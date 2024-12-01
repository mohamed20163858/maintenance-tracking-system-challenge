import React from "react";
import EquipmentForm from "../../components/EquipmentForm";

const EquipmentFormPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Equipment Form</h1>
        <EquipmentForm />
      </div>
    </div>
  );
};

export default EquipmentFormPage;
