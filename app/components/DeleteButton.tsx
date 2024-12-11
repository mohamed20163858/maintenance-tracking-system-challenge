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
        const response = await fetch(`http://localhost:3001/${action}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete ${action} record`);
        }

        alert("Record deleted successfully!");
        router.push(`/${action}`); // Redirect to the equipment or maintenance table
      } catch (error) {
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
