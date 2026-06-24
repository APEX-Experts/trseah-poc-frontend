# Backend Integration Instructions: Admin Proposal Endpoints

This document outlines the recommended backend endpoints, controllers, and services needed to replace the frontend simulations with real database persistence and SSE AI generation.

---

## 1. Controller Abstraction (`admin-proposals.controller.ts`)

Create a new controller `AdminProposalsController` in the backend `proposals` module. This controller should be secured with standard authentication and role-based permissions (e.g., `requests.review` or `requests.invoice`).

```typescript
import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Sse,
  MessageEvent,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { Observable, interval } from "rxjs";
import { map } from "rxjs/operators";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../rbac/guards/permissions.guard";
import { Permissions } from "../rbac/decorators/permissions.decorator";
import { Permission } from "../rbac/constants/permissions.constants";
import { ProposalsService } from "./proposals.service";

@Controller("admin-api/proposals")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get(":id")
  @Permissions(Permission.REQUESTS_REVIEW)
  async getProposalDetails(@Param("id") id: string) {
    return this.proposalsService.getProposalDetailsAdmin(id);
  }

  @Patch("sections/:sectionId")
  @Permissions(Permission.REQUESTS_REVIEW)
  async updateSection(
    @Param("sectionId") sectionId: string,
    @Body() dto: { contentAr?: string; contentEn?: string },
  ) {
    return this.proposalsService.updateProposalSection(
      sectionId,
      dto.contentAr ?? null,
      dto.contentEn ?? null,
    );
  }

  @Post("sections/:sectionId/approve")
  @Permissions(Permission.REQUESTS_REVIEW)
  async approveSection(
    @Param("sectionId") sectionId: string,
    @Body() dto: { humanApproved: boolean },
  ) {
    return this.proposalsService.approveProposalSection(sectionId, dto.humanApproved);
  }

  @Sse("sections/:sectionId/generate")
  @Permissions(Permission.REQUESTS_REVIEW)
  generateSectionStream(@Param("sectionId") sectionId: string): Observable<MessageEvent> {
    // 1. Kick off background LLM call or mock streaming service
    // 2. Return an Observable emitting chunks of text
    // Example:
    const fullText = "تم توليد هذا القسم بنجاح بواسطة الذكاء الاصطناعي...";
    const chunks = fullText.split(" ");

    return interval(100).pipe(
      map((index) => {
        if (index >= chunks.length) {
          // Trigger saving to database in the background when streaming completes
          this.proposalsService.saveAiGeneratedContent(sectionId, fullText);
          return { data: { done: true } };
        }
        return { data: { chunk: chunks[index] + " " } };
      }),
    );
  }
}
```

---

## 2. Service Abstraction (`proposals.service.ts`)

Extend the `ProposalsService` with admin operations that bypass customer organization checks.

```typescript
import { mapProposalResponse } from './dto/proposal-response.dto';
import { mapProposalSectionResponse } from './dto/proposal-section-response.dto';

// In ProposalsService class:

async getProposalDetailsAdmin(proposalId: string) {
  const proposal = await this.proposalsRepository.findById(proposalId);
  if (!proposal) {
    throw new NotFoundException(`Proposal with ID ${proposalId} not found.`);
  }
  const sections = await this.proposalsRepository.findSectionsByProposalId(proposalId);
  return mapProposalResponse(proposal, sections);
}

async updateProposalSection(sectionId: string, contentAr: string | null, contentEn: string | null) {
  const section = await this.proposalsRepository.updateProposalSection(sectionId, {
    contentAr,
    contentEn,
    status: 'completed',
  });
  if (!section) {
    throw new NotFoundException(`Section not found.`);
  }
  return mapProposalSectionResponse(section);
}

async approveProposalSection(sectionId: string, humanApproved: boolean) {
  const section = await this.proposalsRepository.updateProposalSection(sectionId, {
    humanApproved,
  });
  if (!section) {
    throw new NotFoundException(`Section not found.`);
  }
  return mapProposalSectionResponse(section);
}

async saveAiGeneratedContent(sectionId: string, content: string) {
  await this.proposalsRepository.updateProposalSection(sectionId, {
    contentAr: content, // or contentEn depending on language
    aiGenerated: true,
    status: 'completed',
  });
}
```

---

## 3. Registering the Controller (`proposals.module.ts`)

Ensure the new controller is imported and declared in `proposals.module.ts`:

```typescript
import { AdminProposalsController } from "./admin-proposals.controller";

@Module({
  imports: [OrganizationsModule],
  controllers: [ProposalsController, AdminProposalsController], // Add here
  providers: [ProposalsService, ProposalsRepository],
  exports: [ProposalsService, ProposalsRepository],
})
export class ProposalsModule {}
```
