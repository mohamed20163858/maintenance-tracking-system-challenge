import { MaintenanceRecord } from "../../types/maintenance";

interface MaintenanceDetailProps {
  params: { id: string };
}

const MaintenanceDetail = async ({ params }: MaintenanceDetailProps) => {
  const { id } = params;

  // Fetch maintenance record details
  const fetchMaintenanceDetails = async () => {
    const response = await fetch(`http://localhost:3001/maintenance/${id}`, {
      cache: "no-store", // Ensures fresh data
    });
    if (!response.ok) {
      throw new Error("Failed to fetch maintenance details");
    }
    return response.json();
  };

  let maintenance: MaintenanceRecord | null = null;
  try {
    maintenance = await fetchMaintenanceDetails();
  } catch (error) {
    console.error(error);
    maintenance = null;
  }

  if (!maintenance) {
    return (
      <div>
        <h1 className="text-red-500">Failed to load maintenance details</h1>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Maintenance Record Details</h1>
      <table className="w-full border border-gray-300">
        <tbody>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">Date</td>
            <td className="px-4 py-2 border border-gray-300">
              {new Date(maintenance.date).toLocaleDateString()}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">
              Equipment ID
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {maintenance.equipmentId}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">Type</td>
            <td className="px-4 py-2 border border-gray-300">
              {maintenance.type}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">
              Technician
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {maintenance.technician}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">
              Hours Spent
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {maintenance.hoursSpent}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">
              Description
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {maintenance.description}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">
              Parts Replaced
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {maintenance.partsReplaced?.length
                ? maintenance.partsReplaced.join(", ")
                : "None"}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">
              Priority
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {maintenance.priority}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-bold border border-gray-300">
              Completion Status
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {maintenance.completionStatus}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <a href="/maintenance" className="text-blue-500 hover:underline">
          Back to Maintenance Records
        </a>
        <a
          href={`/maintenance/${id}/edit`}
          className="text-blue-500 hover:underline mr-4"
        >
          Edit
        </a>
      </div>
    </div>
  );
};

export default MaintenanceDetail;
