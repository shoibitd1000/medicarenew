import React from "react";

const CustomTable = ({
  Thead = [],
  data = [],
  actions = [],
  striped = false,
  bordered = true,
  hover = true,
  wrapperClass = "", // for outer div
  tableClass = "",   // for <table>
  headerClass = "",  // for <thead>
  rowClass = "",     // for <tr>
  cellClass = "",    // for <td>
}) => {
  return (
    <div className={`overflow-x-auto ${wrapperClass}`}>
      <table
        className={`min-w-full text-sm text-left border-collapse ${tableClass}`}
      >
        <thead className={headerClass}>
          <tr>
            {Thead.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2 font-semibold text-gray-700 ${
                  bordered ? "border" : ""
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th
                className={`px-4 py-2 font-semibold text-gray-700 ${
                  bordered ? "border" : ""
                }`}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={Thead.length + (actions.length > 0 ? 1 : 0)}
                className="text-center py-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${striped && rowIndex % 2 === 0 ? "bg-gray-50" : ""}
                  ${hover ? "hover:bg-gray-100" : ""}
                  ${rowClass}
                `}
              >
                {Thead.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 ${bordered ? "border" : ""} ${cellClass}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td
                    className={`px-4 py-2 flex gap-2 ${
                      bordered ? "border" : ""
                    } ${cellClass}`}
                  >
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => action.onClick(row)}
                        className="px-2 py-1 text-xs rounded bg-blue-300 text-white hover:bg-blue-600"
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
