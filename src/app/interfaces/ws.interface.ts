export interface IWSEvent {
 model: string;
 msg: {
   changed_fields: string[],
   object?: any,
   pk?: number
 }
}
