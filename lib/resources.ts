import directory from "../data/resources.json" with { type: "json" };
export type Resource = (typeof directory)[number];
export const resources: Resource[] = directory;
export const byId = new Map(resources.map((resource) => [resource.id, resource]));
