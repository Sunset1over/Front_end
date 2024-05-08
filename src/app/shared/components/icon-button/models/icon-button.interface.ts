import {IconDefinition} from "@fortawesome/free-solid-svg-icons";

export interface IIconButton{
  isOutside : boolean,
  icon: IconDefinition,
  link?: string,
  classes: "default" | "instagram",
}


