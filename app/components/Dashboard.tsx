import EquipmentStatusPie from "./EquipmentStatusPie";
import MaintenanceHoursBar from "./MaintenanceHoursBar";
import RecentMaintenanceTable from "./RecentMaintenance";

const Dashboard: React.FC = () => {
  return (
    <div className="p-[20px] flex flex-col items-center">
      <h1 className="text-xl font-bold mb-8">Maintenance Dashboard</h1>
      <div className="flex flex-wrap gap-5">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-l font-semibold mb-4">
            Equipment Status Breakdown
          </h2>
          <EquipmentStatusPie />
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-l font-semibold mb-4">
            Maintenance Hours by Department
          </h2>
          <MaintenanceHoursBar />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center my-7">
        <h2 className="text-l font-semibold mb-4">
          Recent Maintenance Activities
        </h2>
        <RecentMaintenanceTable />
      </div>
    </div>
  );
};

export default Dashboard;
