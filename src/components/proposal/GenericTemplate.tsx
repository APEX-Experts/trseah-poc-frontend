function GenericTemplate({ content, isRtl }: { content: string; isRtl: boolean }) {
  return (
    <div className="flex-1 overflow-y-auto ">
      <div
        className="w-full aspect-[1/1.414] bg-white text-neutral-800 rounded-2xl  page-bg p-8 overflow-y-auto border border-neutral-200/50"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}

export default GenericTemplate;
