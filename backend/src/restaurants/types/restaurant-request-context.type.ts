export interface RestaurantRequestContext {
  sub: string;
  email: string;
}

export interface RestaurantMembershipContext {
  id: string;
  role: string;
  status: string;
}
