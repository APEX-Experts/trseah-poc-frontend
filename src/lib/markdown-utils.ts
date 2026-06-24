export const parseCoverPageMarkdown = (
  md: string,
  defaultTitle: string,
  defaultDesc: string,
  defaultEntity: string,
  defaultOrg: string,
  defaultDate: string,
  defaultVision: string,
) => {
  // 1. Extract Title
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : defaultTitle;

  // Matches any thematic break MDXEditor might emit: ---, ***, ___, - - -, * * *
  const BREAK = `(?:-{3,}|\\*{3,}|_{3,}|(?:- ){2,}-|(?:\\* ){2,}\\*)`;

  // 2. Extract Description
  const descMatch = md.match(
    new RegExp(
      `##\\s+(?:Project Description|وصف المشروع|Description|الوصف)\\s*\\n+([\\s\\S]*?)(?=\\n+(?:${BREAK}|#)|$)`,
      "i",
    ),
  );

  let description = descMatch ? descMatch[1].trim() : "";

  // Fallback: everything between the H1 line and the first thematic break / H2
  if (!description) {
    const fallback = md.match(
      new RegExp(`^#\\s+[^\\n]*\\n+([\\s\\S]*?)(?=\\n+(?:${BREAK}|##)|$)`, "m"),
    );
    if (fallback) description = fallback[1].trim();
  }
  if (!description) description = defaultDesc;

  // 3. Centralized Meta Extractor
  // Handles all formatting variants:
  //   **Key:** Value  (colon inside bold  — used by our template)
  //   **Key**:  Value (colon outside bold)
  //   **Key**   Value (no colon at all)
  const extractField = (keys: string[], defaultVal: string) => {
    const pattern = new RegExp(`\\*\\*(?:${keys.join("|")}):?\\*\\*\\s*:?\\s*(.+)$`, "im");
    const match = md.match(pattern);
    return match ? match[1].trim() : defaultVal;
  };

  return {
    title,
    description,
    presentedTo: extractField(["Presented To", "مقدم إلى"], defaultEntity),
    reference: extractField(["Reference", "الرقم المرجعي"], ""),
    date: extractField(["Date", "التاريخ"], defaultDate),
    orgName: extractField(["Organization", "المنظمة"], defaultOrg),
    vision: extractField(["Vision 2030", "رؤية 2030"], defaultVision),
    specialists: extractField(["Specialists", "المتخصصين"], "--"),
    duration: extractField(["Execution Duration", "مدة التنفيذ"], "--"),
    value: extractField(["Project Value", "قيمة المشروع"], "--"),
  };
};
