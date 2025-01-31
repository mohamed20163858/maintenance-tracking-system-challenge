"use client";

import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: string;
  action: "equipment" | "maintenance";
}

const DeleteButton = ({ id, action }: DeleteButtonProps) => {
  const router = useRouter();

  const deleteFunction = async () => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        const BACKEND_URL =
          process.env.BACKEND_URL || "https://maintenance-fake-data.vercel.app";
        const response = await fetch(`${BACKEND_URL}/${action}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete ${action} record`);
        }

        alert("Record deleted successfully!");
        router.push(`/${action}`); // Redirect to the equipment or maintenance table
      } catch {
        // console.error(error);
        alert("Failed to delete the record. Please try again.");
      }
    }
  };

  return (
    <button
      onClick={deleteFunction}
      className="text-red-500 hover:underline ml-4"
      id="delete-button"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
