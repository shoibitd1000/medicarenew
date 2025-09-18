export default function BillDetails() {
  <div className="w-full lg-w-1/2 m-auto">
    <button
      className="mb-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition"
      onClick={() => setActiveSection(null)}
    >
      Back to Categories
    </button>
    <div className="mb-4">
      <CustomDatePicker />
      <CustomDatePicker />
    </div>
    {loading ? (
      <div className="text-center">
        <div className="loader inline-block" />
      </div>
    ) : error ? (
      <p className="text-red-500 text-center">{error}</p>
    ) : filteredBills.length === 0 ? (
      <p className="text-gray-500 text-center text-lg font-bold">
        NO {activeSection.toUpperCase()} BILLS
      </p>
    )
           </div>
  );
}
