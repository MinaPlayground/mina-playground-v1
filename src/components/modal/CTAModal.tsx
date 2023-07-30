import { FC, PropsWithChildren } from "react";

const CTAModal: FC<PropsWithChildren<CTAModalProps>> = ({
  isVisible,
  close,
  id,
  children,
}) => {
  const openModalClassName = isVisible ? "modal-open" : null;

  return (
    <>
      <input onChange={close} type="checkbox" id={id} className="invisible" />
      <label
        htmlFor={id}
        className={`modal modal-bottom sm:modal-middle ${openModalClassName}`}
      >
        <label className="modal-box relative bg-gray-800" htmlFor="">
          <label
            htmlFor={id}
            className="btn btn-sm btn-circle absolute right-2 top-2 btn-primary text-white"
          >
            ✕
          </label>
          {children}
        </label>
      </label>
    </>
  );
};

interface CTAModalProps {
  isVisible: boolean;
  id: string;
  close(): void;
}

export default CTAModal;
