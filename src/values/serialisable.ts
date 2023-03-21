export default interface Serialisable {
  toJson(): Record<string, unknown>;
}
