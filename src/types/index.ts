import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export enum AuthRole {
  "SuperAdmin" = -1,
  "Admin" = 1,
  "User" = 0
}

export enum PartnerType {
  "DONOR" = 1,
  "PARTNER" = 0
}