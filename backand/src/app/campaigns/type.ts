export interface ICampaignCreate {
  endAt: string;
  name: string;
  startAt: string;
  description?: string;
  segmentId: number;
}
