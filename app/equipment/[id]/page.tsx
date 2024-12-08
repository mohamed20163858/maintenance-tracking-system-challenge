import { Equipment } from "../../types/equipment";

interface EquipmentDetailProps {
  params: { id: string };
}

const EquipmentDetail = async ({ params }: EquipmentDetailProps) => {
  const { id } = params;

  // Fetch the equipment details
  const fetchEquipmentDetails = async () => {
    const response = await fetch(`http://localhost:3001/equipment/${id}`, {
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
        <a href="/equipment" className="text-blue-500 hover:underline">
          Back to Equipment List
        </a>
        <a
          href={`/equipment/${id}/edit`}
          className="text-blue-500 hover:underline mr-4"
        >
          Edit
        </a>
      </div>
    </div>
  );
};

export default EquipmentDetail;
