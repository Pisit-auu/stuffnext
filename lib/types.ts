/** ชนิดข้อมูลกลางที่ตรงกับ prisma/schema.prisma — ใช้แทน any ในหน้าจอทั้งหมด */

export type Role = "user" | "admin";
/** w = รอตรวจสอบ, c = ตรวจสอบแล้ว */
export type Status = "w" | "c";

export type Category = {
  id: number;
  idname: string;
  name: string;
};

export type CategoryRoom = {
  id: number;
  name: string;
};

export type Location = {
  id: number;
  namelocation: string;
  nameteacher: string | null;
  categoryIdroom: number | null;
  categoryroom?: CategoryRoom | null;
};

export type Asset = {
  id: number;
  name: string;
  img: string | null;
  assetid: string;
  categoryId: string;
  availableValue: number;
  unavailableValue: number;
  createdAt: string;
  category: Category;
};

export type AssetLocation = {
  id: number;
  assetId: string;
  locationId: string;
  inRoomavailableValue: number;
  inRoomaunavailableValue: number;
  createdAt: string | null;
  asset: Asset;
  location: Location;
};

/** แถวในห้อง หลังหักจำนวนที่ถูกยืมออกไปแล้ว */
export type RoomAssetRow = AssetLocation & { borrowed: number };

export type BorrowUser = {
  id?: number;
  name: string | null;
};

export type Borrow = {
  id: number;
  createdAt: string;
  dayReturn: string | null;
  Borrowstatus: Status;
  ReturnStatus: Status;
  userId?: number;
  assetId?: string;
  valueBorrow: number;
  borrowLocationId?: string;
  returnLocationId: string;
  note: string | null;
  user: BorrowUser;
  asset: Pick<Asset, "name" | "assetid"> & { id?: number };
  borrowLocation: Pick<Location, "namelocation">;
};

export type AppUser = {
  id: number;
  name: string | null;
  surname: string | null;
  username: string;
  email: string | null;
  tel: string | null;
  role: Role;
  password?: string;
};
