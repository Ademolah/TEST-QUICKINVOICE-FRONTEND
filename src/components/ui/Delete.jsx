import { Trash2 } from "lucide-react";

export default function PremiumTrashButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full bg-red-50 hover:bg-red-100 
                 transition-all shadow-sm hover:shadow-md"
    >
      <Trash2
        className="text-red-500 hover:scale-110 transition-transform"
        size={18}
      />
    </button>
  );
}
