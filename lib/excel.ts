import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export type SheetColumn<T> = {
  header: string;
  width?: number;
  value: (row: T) => string | number | null | undefined;
};

/**
 * ตัวส่งออก Excel กลางของทั้งระบบ
 * เดิมโค้ดชุดนี้ถูกคัดลอกซ้ำอยู่ 9 หน้า ตอนนี้เหลือที่เดียว
 * หัวตารางถูกจัดรูปให้อ่านง่ายในไฟล์ที่โรงเรียนเอาไปทำรายงานต่อ
 */
export async function exportSheet<T>({
  filename,
  sheetName,
  columns,
  rows,
}: {
  filename: string;
  sheetName: string;
  columns: SheetColumn<T>[];
  rows: T[];
}): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns.map((c, i) => ({
    header: c.header,
    key: `c${i}`,
    width: c.width ?? 22,
  }));

  rows.forEach((row) => {
    const record: Record<string, string | number> = {};
    columns.forEach((c, i) => {
      const v = c.value(row);
      record[`c${i}`] = v === null || v === undefined || v === "" ? "-" : v;
    });
    worksheet.addRow(record);
  });

  const header = worksheet.getRow(1);
  header.font = { bold: true };
  header.alignment = { vertical: "middle" };
  header.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEDEDEA" },
    };
    cell.border = { bottom: { style: "thin", color: { argb: "FFB9B9B1" } } };
  });
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`,
  );
}
