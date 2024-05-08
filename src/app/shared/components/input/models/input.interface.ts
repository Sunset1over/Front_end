import {IconDefinition} from "@fortawesome/free-solid-svg-icons";

export interface IInput{
  type: 'default' | 'textarea',//in future using "|" u can add new types
  placeholder: string,
  size?: 'default' | 'small' | 'normal'
  icon?: IconDefinition,
  error?: string,
  isDisabled: boolean,
  isChangingType?: boolean | false;
}

export interface definitionInterface{
  param:string;
}


