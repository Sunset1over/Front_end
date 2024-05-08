import {IconDefinition} from "@fortawesome/free-solid-svg-icons";

export interface MainButtonInterface{
  text: string;
  icon: IconDefinition;
  link?: string;
  classes: "red" | "yellow" | "green" | "dark";
  size: "default" | "small" | "big" ;

}
