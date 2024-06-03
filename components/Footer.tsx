"use client"
// @ts-ignore
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

export const Footer = () => {
  return (
    <footer className="align-middle items-center flex-row w-full border-t p-4 flex justify-between ">
      <div className="flex-1">
        Built by the team behind{" "}
        <a
          className="font-bold"
          target="_blank"
          href="https://www.therequirementlist.com/"
        >
          The Requirement List
        </a>
      </div>

      <TawkMessengerReact
        propertyId="649051de94cf5d49dc5e99cd"
        widgetId="1h39rvjn7"
      />

      <div className="flex-1 flex items-center text-center flex-col ">
        <div>Trusted by the leading property consultancies in the UK</div>
        <img src="images/logos.png" alt="" className="max-w-[200px]" />
      </div>
      <div></div>
    </footer>
  );
};
