import DeleteButton from "@/app/components/DeleteButton";
import { Equipment } from "../../types/equipment";
import Link from "next/link";

interface EquipmentDetailProps {
  params: Promise<{ id: string }>;
}

const EquipmentDetail = async ({ params }: EquipmentDetailProps) => {
  const { id } = await params;

  // Fetch the equipment details
  const fetchEquipmentDetails = async () => {
    const BACKEND_URL =
      process.env.BACKEND_URL || "https://maintenance-fake-data.vercel.app";
    const response = await fetch(`${BACKEND_URL}/equipment/${id}`, {
      cache: "no-store", // Ensures the latest data is fetched
    });
    if (!response.ok) {
      throw new Error("Failed to fetch equipment details");
    }
    return response.json();
  };

  let equipment: Equipment | null = null;
  try {
    equipment = await fetchEquipmentDetails();
  } catch (error) {
    console.error(error);
    equipment = null;
  }

  if (!equipment) {
    return (
      <div>
        <h1 className="text-red-500">Failed to load equipment details</h1>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Equipment Details</h1>
      <table className="w-full border border-red-500">
        <tbody>
          <tr>
            <td className="px-4 py-2 font-bold border border-red-500">Name</td>
            <td className="px-4 py-2 border border-red-500">
              {equipment.name}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-red-500">
              Location
            </td>
            <td className="px-4 py-2 border border-red-500">
              {equipment.location}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-red-500">
              Department
            </td>
            <td className="px-4 py-2 border border-red-500">
              {equipment.department}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-red-500">Model</td>
            <td className="px-4 py-2 border border-red-500">
              {equipment.model}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-red-500">
              Serial Number
            </td>
            <td className="px-4 py-2 border border-red-500">
              {equipment.serialNumber}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-red-500">
              Install Date
            </td>
            <td className="px-4 py-2 border border-red-500">
              {new Date(equipment.installDate).toLocaleDateString()}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-red-500">
              Status
            </td>
            <td className="px-4 py-2 border border-red-500">
              {equipment.status}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <Link href="/equipment" className="text-blue-500 hover:underline">
          Back to Equipment List
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/equipment/${id}/edit`}
            className="text-blue-500 hover:underline mr-4"
          >
            Edit
          </Link>
          <p>|</p>
          <DeleteButton id={id} action={"equipment"} />
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
