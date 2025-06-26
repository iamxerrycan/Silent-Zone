export type Zone = {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
};

export type RootStackParamList = {
  Home: undefined;
  Location: { editZone?: Zone };
};
