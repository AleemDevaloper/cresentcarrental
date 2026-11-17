import React from 'react';
import CrmLeadDetail from './CrmLeadDetail';
import CrmContactDetail from './CrmContactDetail';
import CrmCustomerDetail from './CrmCustomerDetail';
import CrmDealDetail from './CrmDealDetail';
import CrmActivityDetail from './CrmActivityDetail';
import CrmCampaignDetail from './CrmCampaignDetail';

export { CrmLeadDetail, CrmContactDetail, CrmCustomerDetail, CrmDealDetail, CrmActivityDetail, CrmCampaignDetail };

const CrmDetailRouter = ({ entityType, entityId, onBack }) => {
  if (!entityType || !entityId) {
    return <div className="alert alert-warning">No record selected.</div>;
  }
  switch (entityType) {
    case 'lead':
      return <CrmLeadDetail leadId={entityId} onBack={onBack} />;
    case 'contact':
      return <CrmContactDetail contactId={entityId} onBack={onBack} />;
    case 'customer':
      return <CrmCustomerDetail customerId={entityId} onBack={onBack} />;
    case 'deal':
      return <CrmDealDetail dealId={entityId} onBack={onBack} />;
    case 'activity':
      return <CrmActivityDetail activityId={entityId} onBack={onBack} />;
    case 'campaign':
      return <CrmCampaignDetail campaignId={entityId} onBack={onBack} />;
    default:
      return <div className="alert alert-warning">Unsupported entity type: {entityType}</div>;
  }
};

export default CrmDetailRouter;