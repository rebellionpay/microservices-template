export interface MicroserviceMessage<T = any, K = any> {
  data: T,
  metadata?: K
}