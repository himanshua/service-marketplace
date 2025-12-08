"use client";
import { useEffect } from "react";
import Script from "next/script";
import { shareImages } from "../share/data";

export default function UniversalShareBar({ shareKey }) {
  const item = shareImages[shareKey];
  if (!item) return null;

  useEffect(() => {
    if (typeof window !== "undefined" && window.a2a) window.a2a.init_all();
  }, [shareKey]);

  return (
    <>
      <Script src="https://static.addtoany.com/menu/page.js" strategy="lazyOnload" />
      <div
        className="a2a_kit a2a_kit_size_32 a2a_default_style"
        data-a2a-title={item.title}
        data-a2a-url={`https://aheadterra.com/share/${shareKey}`}
      >
        <a className="a2a_button_facebook" />
        <a className="a2a_button_x" />
        <a className="a2a_button_whatsapp" />
        <a className="a2a_button_linkedin" />
        <a className="a2a_button_telegram" />
        <a className="a2a_button_email" />
        <a className="a2a_button_copy_link" />
        <a className="a2a_dd" />
      </div>
    </>
  );
}