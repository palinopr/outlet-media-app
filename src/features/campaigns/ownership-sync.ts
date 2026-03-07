interface CampaignLinkedEntitySets {
  approvalIds: Set<string>;
  campaignActionItemIds: Set<string>;
  campaignCommentIds: Set<string>;
  campaignIds: Set<string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function metadataCampaignId(row: Record<string, unknown>) {
  if (!isRecord(row.metadata)) return null;
  const campaignId = row.metadata.campaignId;
  return typeof campaignId === "string" && campaignId.length > 0 ? campaignId : null;
}

export function approvalMatchesCampaignOwnership(
  row: Record<string, unknown>,
  campaignIds: Set<string>,
) {
  const entityType = typeof row.entity_type === "string" ? row.entity_type : null;
  const entityId = typeof row.entity_id === "string" ? row.entity_id : null;

  if (entityType === "campaign" && entityId && campaignIds.has(entityId)) {
    return true;
  }

  const campaignId = metadataCampaignId(row);
  return !!campaignId && campaignIds.has(campaignId);
}

export function notificationMatchesCampaignOwnership(
  row: Record<string, unknown>,
  entities: CampaignLinkedEntitySets,
) {
  const entityType = typeof row.entity_type === "string" ? row.entity_type : null;
  const entityId = typeof row.entity_id === "string" ? row.entity_id : null;
  if (!entityType || !entityId) return false;

  switch (entityType) {
    case "campaign":
      return entities.campaignIds.has(entityId);
    case "campaign_comment":
      return entities.campaignCommentIds.has(entityId);
    case "campaign_action_item":
      return entities.campaignActionItemIds.has(entityId);
    case "approval_request":
      return entities.approvalIds.has(entityId);
    default:
      return false;
  }
}

export function systemEventMatchesCampaignOwnership(
  row: Record<string, unknown>,
  entities: CampaignLinkedEntitySets,
) {
  const entityType = typeof row.entity_type === "string" ? row.entity_type : null;
  const entityId = typeof row.entity_id === "string" ? row.entity_id : null;

  if (entityType && entityId) {
    switch (entityType) {
      case "campaign":
        if (entities.campaignIds.has(entityId)) return true;
        break;
      case "campaign_comment":
        if (entities.campaignCommentIds.has(entityId)) return true;
        break;
      case "campaign_action_item":
        if (entities.campaignActionItemIds.has(entityId)) return true;
        break;
      case "approval_request":
        if (entities.approvalIds.has(entityId)) return true;
        break;
      default:
        break;
    }
  }

  const campaignId = metadataCampaignId(row);
  return !!campaignId && entities.campaignIds.has(campaignId);
}
