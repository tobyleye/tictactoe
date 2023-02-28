import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      <div className="block">
        <div className="inline-block relative">
          <span className="cursor-pointer underline">{text}</span>
          {copied && (
            <div className="copied inline-block absolute bottom-[-28px]  right-[-18px] text-sm bg-blue-300 p-1 rounded-md text-white ">
              Copied!
            </div>
          )}
        </div>

        <style jsx>{`
          .copied {
            animation: copied 0.1s ease;
          }

          @keyframes copied {
            0% {
              transform: scale(0.4);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </CopyToClipboard>
  );
}
