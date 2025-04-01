import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export enum AuthRole {
  "SuperAdmin" = -1,
  "Admin" = 1,
  "Alumni" = 2,
  "Employee" = 3,
  "User" = 0,
  "Volunteer" = 4,
  "Intern" = 5,
  "BoardMember" = 6,
}

export enum PartnerType {
  "DONOR" = 1,
  "PARTNER" = 0,
  "COLLABORATOR" = 2
}