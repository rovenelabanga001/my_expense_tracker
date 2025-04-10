"use client";
import "./Modal.css";
import { IoMdCloseCircle } from "react-icons/io";
import { cloneElement, useState } from "react";

export default function Modal({ trigger, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return (
    <>
      {cloneElement(trigger, { onClick: open })}

      {isOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="modal-close" onClick={close}>
              <IoMdCloseCircle />
            </button>
            {typeof children === "function" ? children({ close }) : children}
          </div>
        </div>
      )}
    </>
  );
}
