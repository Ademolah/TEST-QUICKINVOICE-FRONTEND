import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      {/* Dialog content wrapper */}
      <div
        className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-4 z-50 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children }) {
  return <div className="space-y-4">{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="border-b pb-3 mb-3">{children}</div>;
}

export function DialogTitle({ children }) {
  return (
    <h2 className="text-lg font-semibold text-gray-800">{children}</h2>
  );
}

export function DialogTrigger({ asChild, children, onClick }) {
  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        onClick && onClick(e);
      },
    });
  }

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-[#0046A5] text-white rounded-lg hover:bg-[#003a8a] transition"
    >
      {children}
    </button>
  );
}
