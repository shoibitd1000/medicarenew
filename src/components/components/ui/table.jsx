import React from "react";

export function Table({ className = "", children, ...props }) {
  return (
    <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <table
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = "", children, ...props }) {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className = "", children, ...props }) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function TableFooter({ className = "", children, ...props }) {
  return (
    <tfoot className={className} {...props}>
      {children}
    </tfoot>
  );
}

export function TableRow({ className = "", children, ...props }) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className = "", children, ...props }) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className = "", children, ...props }) {
  return (
    <td className={`p-4 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}

export function TableCaption({ className = "", children, ...props }) {
  return (
    <caption className={`mt-4 text-sm ${className}`} {...props}>
      {children}
    </caption>
  );
}
