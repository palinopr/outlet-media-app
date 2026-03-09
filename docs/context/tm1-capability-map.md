# TM1 Capability Map

This file is generated from authenticated TM1 route crawling plus recursively discovered TM1 source maps. It is broader than a single loaded module, but it still only covers the TM1 bundles discoverable from the scanned routes.

Generated: 2026-03-08T02:41:13.637Z

## Source Maps

- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/266.js.map (1 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/125.js.map (3 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/_flatRest-UhSY34FA.js.map (4 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/745.js.map (2 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/index-DINN0uO5.js.map (0 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/409.js.map (3 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/186.js.map (1 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/379.js.map (3 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/484.js.map (103 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/196.js.map (4 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/handler-BQm2Z65e.js.map (6 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/main-Dv4q5jk4.js.map (0 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/design-system.themes/402dabf4/index-CKBMSKXI.js.map (26 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/105.js.map (164 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/resize-observer-C3XoULDt.js.map (23 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/v1-DweXrwCl.js.map (21 sources)
- https://one.ticketmaster.com/cdn/tm1-ui/app/bootstrap.559d6a8c7bde582c1eed.js.map (12 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/v1beta1-Cjjm9l9D.js.map (9 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/polyfills-Dz5yZpge.js.map (7 sources)
- https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/main.js.map (4099 sources)
- https://one.ticketmaster.com/cdn/PRD3100/tm1-ufo/@tm1/initializer/294b1158/main-1RTPIvuy.js.map (472 sources)

## Stats

- Interesting source files: 2950
- Rest-service files: 206
- Files with endpoint templates: 57
- Total extracted methods: 6985
- Total extracted exported functions: 1175
- Total extracted endpoint templates: 254

## Top Endpoint Files

### ./src/app/rest-services/client-settings/client-settings-rest.service.ts

Classes: ClientSettingsRestService

Public methods: addEventCodePrefix, addOrUpdateFinancialContracts, createClientProfile, createSystemTemplate, deleteEventCodePrefix, deleteFinancialContract, deleteQualifierCatalog, deleteSystemTemplate, disableFeature, enableFeature, enableLayout, getAssociatedClientProfile, getClientProfile, getClientProfileByOrganizationAndVenue, getClients, getIsmOnboardingValidationResults, importHostPublicationSettings, importQualifierCatalog, onboardClientToCreate, renameQualifierCatalog, searchCasScenarios, searchClients, setDefaultEventCodePrefix, updateAgeRestriction, updateAllInPricingIncludedInDisplay, updateArchticsSettingEnabled, updateBestAvailable, updateContactEmail, updateContactName, updateDefaultFacilityFee, updateDefaultFacilityFeeSettings, updateDoorsTimeOffset, updateEnhancedGeneralAdmissionEnabled, updateEventCodeDateFormat, updateFacilityFeeIncludedInDisplay, updateFacilityFeeIncludedInTaxes, updateFinancialContract, updateGeneralOffsaleOffset, updateIncludedTaxesPercentage, updateMfxVenueId, updateMusicServices, updatePromotersSettings, updateSeatsByRequest, updateServiceChargeIncludedInDisplay, updateServiceChargeTax, updateTicketLimit, updateValueAddedTax, updateVenueLayoutSettings, validateIsmOnboarding

Endpoints:
- `${this.baseUrl}/clientsetup/${eventId}/client`
- `${this.baseUrl}/clientsetup/${venueLayoutSettings.clientId}/venueLayoutSettings`
- `${this.baseUrl}/clientsetup/client/${clientId}/layout/${layoutId}/enabled?organizationId=${organizationId}`
- `${this.baseUrl}/clientsetup/clients`
- `${this.baseUrl}/clientsetup/clients?keyword=${encodeURIComponent(venueKeyword)}`
- `${this.baseUrl}/clientsetup/clients/${clientId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/ageRestriction`
- `${this.baseUrl}/clientsetup/clients/${clientId}/allInPricingIncludedInDisplay?venueId=${venueId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/archticsSetting`
- `${this.baseUrl}/clientsetup/clients/${clientId}/bestAvailableSetting`
- `${this.baseUrl}/clientsetup/clients/${clientId}/contacts/${contactType}/email`
- `${this.baseUrl}/clientsetup/clients/${clientId}/contacts/${contactType}/name`
- `${this.baseUrl}/clientsetup/clients/${clientId}/currentStage?organizationId=${organizationId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/doorsTimeOffset`
- `${this.baseUrl}/clientsetup/clients/${clientId}/enhancedGeneralAdmissionSetting`
- `${this.baseUrl}/clientsetup/clients/${clientId}/eventCodeDateFormat`
- `${this.baseUrl}/clientsetup/clients/${clientId}/facilityFee`
- `${this.baseUrl}/clientsetup/clients/${clientId}/facilityFeeIncludedInDisplay`
- `${this.baseUrl}/clientsetup/clients/${clientId}/facilityFeeIncludedInTaxes`
- `${this.baseUrl}/clientsetup/clients/${clientId}/facilityFeeSettings`
- `${this.baseUrl}/clientsetup/clients/${clientId}/features/${settingFeatureName}/disable`
- `${this.baseUrl}/clientsetup/clients/${clientId}/features/${settingFeatureName}/enable`
- `${this.baseUrl}/clientsetup/clients/${clientId}/financialContracts`
- `${this.baseUrl}/clientsetup/clients/${clientId}/financialContracts/${financialContract.id}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/financialContracts/${financialContractId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/hostPublicationSettings?eventId=${eventId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/includedTaxesPercentage`
- `${this.baseUrl}/clientsetup/clients/${clientId}/mfxPublicationSettings/mfxVenueId`
- `${this.baseUrl}/clientsetup/clients/${clientId}/musicServices`
- `${this.baseUrl}/clientsetup/clients/${clientId}/offsaleOffset`
- `${this.baseUrl}/clientsetup/clients/${clientId}/prefixes`
- `${this.baseUrl}/clientsetup/clients/${clientId}/prefixes/${prefixId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/prefixes/${prefixId}/default`
- `${this.baseUrl}/clientsetup/clients/${clientId}/promoters`
- `${this.baseUrl}/clientsetup/clients/${clientId}/qualifierCatalog?venueId=${venueId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/qualifierCatalog/${qualifierCatalogId}?venueId=${venueId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/qualifierCatalog/import?venueId=${venueId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/seatsByRequestSetting`
- `${this.baseUrl}/clientsetup/clients/${clientId}/serviceChargeIncludedInDisplay`
- `${this.baseUrl}/clientsetup/clients/${clientId}/serviceChargeTax`
- `${this.baseUrl}/clientsetup/clients/${clientId}/ticketLimit`
- `${this.baseUrl}/clientsetup/clients/${clientId}/valueAddedTax`
- `${this.baseUrl}/clientsetup/clients/${organizationId}/${venueId}`
- `${this.baseUrl}/clientsetup/ismOnboarding/validate`
- `${this.baseUrl}/clientsetup/ismOnboarding/validation/${ismOnboardingValidationId}/results`
- `${this.baseUrl}/clientsetup/operations/search/casScenario?keyword=${encodeURIComponent(keyword)}`
- `${this.baseUrl}/clientsetup/systemTemplate?venueId=${venueId}&organizationId=${organizationId}`
- `${this.baseUrl}/clientsetup/systemTemplate/${systemTemplateId}?venueId=${venueId}&organizationId=${organizationId}`

### ./src/app/rest-services/offer/offer-rest.service.ts

Classes: OfferRestService

Public methods: addPassword, createOffer, deleteOffer, deletePassword, editPassword, linkOfferToPricing, listOffers, publish, setOfferCustomDate, synchronizeSalesChannels, unlinkOfferFromPricing, updateAbsolutePricing, updateAvailability, updateDescription, updateMinimumPrice, updateMoreInfoLinkText, updateMoreInfoLinkUrl, updateName, updateOffer, updateOfferPrivacy, updateOfferSalesChannelEnabled, updateOfferSalesChannelRole, updateOfferTranslatableItemInfos, updatePasswordRolledUp, updatePasswords, updatePriceLevelPriceType, updatePricing, updateReportingGroupId, updateRepricingType, updateRoundingIncrement, updateRoundingType, updateShortName, updateSystemOfferType, updateTicketLimits, validate

Endpoints:
- `${this.baseUrl}/events/${eventId}/offers`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/absolutePricing`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/customDate`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/delete`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/description`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/linkText`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/linkUrl`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/name`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/password`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/password/delete`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/password/edit`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/password/rolledUp`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/passwords`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/period`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/priceType`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/link`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/minimumPrice`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/reportingGroup`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/repricingType`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/roundingIncrement`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/roundingType`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/unlink`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/private`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/setSalesChannelEnabled`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/setSalesChannelRole`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/shortName`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/systemOfferType`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/ticketLimits`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/translatableItemInfos`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/update`
- `${this.baseUrl}/events/${eventId}/offers/publishOffer`
- `${this.baseUrl}/events/${eventId}/offers/synchronizeSalesChannels`
- `${this.baseUrl}/events/${eventId}/offers/validate`
- `${this.baseUrl}/events/${request.eventId}/offers/${request.offerId}`

### ./src/app/rest-services/event/event.rest-service.ts

Classes: EventRestService

Public methods: check, create, createTemplate, delete, duplicate, getSystemTemplateSettlementCode, listEventTemplates, loadEvent, loadStandaloneEvent, requestPublish, requestUpdateOnsaleDate, requestUpdatePerformanceDate, rescheduleEvent, saveAsTemplate, updateAgeRestriction, updateAttractions, updateDoorsTime, updateEventInfo, updateEventVisibilityDate, updateFees, updateOnsaleDate, updatePerformanceDate, updatePromoters, updateReportFlags, updateTicketTexts, validateMarketedEvent

Endpoints:
- `${this.baseUrl}/events/${encodeURIComponent(eventId)}`
- `${this.baseUrl}/events/${encodeURIComponent(eventId)}/id`
- `${this.baseUrl}/events/${eventId}`
- `${this.baseUrl}/events/${eventId}?venueId=${venueId}&eventType=${eventType}`
- `${this.baseUrl}/events/${eventId}/fees/update`
- `${this.baseUrl}/events/${eventId}/promoters`
- `${this.baseUrl}/events/${eventId}/reporting/reportFlags`
- `${this.baseUrl}/events/${eventId}/requestOnsaleUpdate`
- `${this.baseUrl}/events/${eventId}/requestPerformanceDateUpdate`
- `${this.baseUrl}/events/${eventId}/requestPublish`
- `${this.baseUrl}/events/${eventId}/reschedule`
- `${this.baseUrl}/events/${eventId}/standalone`
- `${this.baseUrl}/events/${eventId}/updateAgeRestriction`
- `${this.baseUrl}/events/${eventId}/updateAttractions`
- `${this.baseUrl}/events/${eventId}/updateDoorsTime`
- `${this.baseUrl}/events/${eventId}/updateEventInfo`
- `${this.baseUrl}/events/${eventId}/updateOnsaleDate`
- `${this.baseUrl}/events/${eventId}/updatePerformanceDate`
- `${this.baseUrl}/events/${eventId}/updateTicketTexts`
- `${this.baseUrl}/events/${eventId}/validateMarketedEvent`
- `${this.baseUrl}/events/${eventId}/visibilityDate`
- `${this.baseUrl}/events/${sourceEventId}/duplicate`
- `${this.baseUrl}/events/${ticketingSubsystemId}/${systemEventId}/settlementCode`
- `${this.baseUrl}/events/templates`
- `${this.baseUrl}/events/templates?venueId=${encodeURIComponent(venueId)}`
- `${this.baseUrl}/events/templates?venueId=${request.venueId}`

### ./src/app/rest-services/event/event-config-rest.service.ts

Classes: EventConfigRestService

Public methods: addOrganizationPrivileges, deleteOrganizationPrivileges, updateEventCodePrefix, updateEventCodeSuffix, updateEventCodeType, updateFacilityFee, updateFacilityFees, updateOptionalRoll, updateQualifierCatalog, updateSettlementCode

Endpoints:
- `${this.baseUrl}/events/${eventId}/eventCodePrefix`
- `${this.baseUrl}/events/${eventId}/eventCodeSuffix`
- `${this.baseUrl}/events/${eventId}/eventCodeType`
- `${this.baseUrl}/events/${eventId}/optionalRoll`
- `${this.baseUrl}/events/${eventId}/organizationsPrivileges`
- `${this.baseUrl}/events/${eventId}/organizationsPrivileges/${request.organizationCode}/delete`
- `${this.baseUrl}/events/${eventId}/qualifierCatalog`
- `${this.baseUrl}/events/${eventId}/updateFacilityFee`
- `${this.baseUrl}/events/${eventId}/updateFacilityFees`
- `${this.baseUrl}/events/${eventId}/updateSettlementCode`

### ./src/app/rest-services/client-settings/add-on-settings/add-on-settings-rest.service.ts

Classes: AddOnSettingsRestService

Public methods: addOrUpdateFinancialContracts, createAddOnSettings, deleteAddOnSettings, deleteFinancialContract, getAddOnValidationResults, updateAddOnDetails, updateAddOnEventDefaults, updateAddOnSettings, updateAddOnTicketOption, updateFinancialContract

Endpoints:
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/addOnDetails`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/eventDefaults`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/financialContracts`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/financialContracts/${financialContract.id}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/ticketOptions`
- `${this.baseUrl}/clientsetup/venue/${venueId}/event/${eventId}/addOnSettings`

### ./src/app/rest-services/collaboration/collaboration-rest.service.ts

Classes: CollaborationRestService

Public methods: acknowledgeMessages, addMemberToTeam, changeRequestStatus, findTeamByEventId, getMessages, removeMemberFromTeam, searchUserByName, sendMessage, setRecapEmailsSubscription

Endpoints:
- `${this.baseUrl}/${eventId}/searchUser?username=${encodeURIComponent(userName)}`
- `${this.baseUrl}/${eventId}/team`
- `${this.baseUrl}/${eventId}/team/add`
- `${this.baseUrl}/${eventId}/team/member/${memberId}/recapEmailsSubscription`
- `${this.baseUrl}/${eventId}/team/messages`
- `${this.baseUrl}/${eventId}/team/messages/acknowledge`
- `${this.baseUrl}/${eventId}/team/remove`
- `${this.baseUrl}/${eventId}/team/request/${id}/resolve`

### ./src/app/rest-services/inventory/inventory-rest.service.ts

Classes: InventoryRestService

Public methods: getInventory, moveSelectionToAllocation, moveSelectionToAttribute, moveSelectionToOpen, moveSelectionToPriceLevel, moveSelectionToPricingType, moveSelectionToUnassigned, synchronizeCatalog

Endpoints:
- `${this.baseUrl}/events/${eventId}/inventory`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/allocation/${targetId}`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/attribute/${attributeId}`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/priceLevel/${priceLevelId}`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/pricingType/${pricingTypeId}`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/standardOfferAllocation`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/unassignedPriceLevel`
- `${this.baseUrl}/events/${eventId}/inventory/synchronizeAllocations`

### ./src/app/rest-services/inventory/seatStatus/seat-status-rest.service.ts

Classes: SeatStatusRestService

Public methods: createAllocationGroup, createSeatStatus, deleteAllocationGroup, deleteSeatStatus, updateAllocationGroupName, updateAllocationGroupType, updateName

Endpoints:
- `${this.baseUrl}/inventories/${deleteHoldRequest.inventoryId}/holds/${deleteHoldRequest.deletedHoldId}/delete`
- `${this.baseUrl}/inventories/${inventoryId}/allocationGroups`
- `${this.baseUrl}/inventories/${inventoryId}/allocationGroups/${action.allocationGroupId}/type`
- `${this.baseUrl}/inventories/${inventoryId}/allocationGroups/${request.allocationGroup.id}/name`
- `${this.baseUrl}/inventories/${inventoryId}/allocationGroups/${request.allocationGroupId}/delete`
- `${this.baseUrl}/inventories/${inventoryId}/holds/${request.id}/name`
- `${this.baseUrl}/inventories/${inventoryId}/holds/${seatStatusId}`

### ./src/app/rest-services/offer/offer-inventory-rest.service.ts

Classes: OfferInventoryRestService

Public methods: addAllocationOfferAssociation, removeAllocationOfferAssociation, replaceOfferAllocation, updateAllocationName, updateAllocationShortName, updateInventoryType, updateOfferAllocationType

Endpoints:
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/allocations/${allocationId}/association`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/allocations/${request.allocationId}/association/delete`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/allocations/${request.allocationId}/name`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/allocations/${request.allocationId}/shortName`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/inventoryType`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/replaceAllocation`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/updateAllocationType`

### ./src/app/rest-services/venue-configuration/layout/layout-rest.service.ts

Classes: LayoutRestService

Public methods: deleteLayout, getLayoutList, updateEventTypeOverride, updateHotSpot, updateLayoutName, updateStaticMapId

Endpoints:
- `${this.baseUrl}/venuelayout/${layout.id}`
- `${this.baseUrl}/venuelayout/${layout.id}/eventTypeOverride`
- `${this.baseUrl}/venuelayout/${layout.id}/name`
- `${this.baseUrl}/venuelayout/${layout.id}/staticMapId`
- `${this.baseUrl}/venuelayout/${layoutId}/hotspot`
- `${this.baseUrl}/venuelayouts?venueId=${venueId}&includeTotals=${includeTotals.toString()}`

### ./src/app/rest-services/customimage/custom-image-rest.service.ts

Classes: CustomImageRestService

Public methods: createUploadHistoryEntry, deleteEventImageAugmentation, deleteEventLevelImage, getImage, uploadImage, validateImage

Endpoints:
- `${this.baseUrl}/events/customImage/${eventId}`
- `${this.baseUrl}/events/customImage/${eventId}/delete-augmentation`
- `${this.baseUrl}/events/customImage/${eventId}/upload`
- `${this.baseUrl}/events/customImage/${eventId}/upload/history`
- `${this.baseUrl}/events/customImage/validate`

### ./src/app/rest-services/discrete-links/discrete-links-rest.service.ts

Classes: DiscreteLinksRestService

Public methods: deleteDiscreteLink, offerAddDiscreteLink, offerLinkDiscreteLink, offerUnlinkDiscreteLink, updateDiscreteLink

Endpoints:
- `${this.baseUrl}/events/${eventId}/discreteLinks/${discreteLink.id}`
- `${this.baseUrl}/events/${eventId}/discreteLinks/${discreteLinkId}/delete`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/discreteLinks/${discreteLink.id}`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/discreteLinks/${discreteLinkId}/link`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/discreteLinks/${discreteLinkId}/unlink`

## Rest Services

### ./src/app/rest-services/add-ons/add-on-rest.service.mock.ts

Classes: AddOnRestServiceMock
Methods: public create, public delete, public list, public updateAddOn

### ./src/app/rest-services/add-ons/add-on-rest.service.ts

Classes: AddOnRestService
Methods: public create, public delete, public list, public updateAddOn
Endpoints:
- `${this.baseUrl}/events/${eventId}/addOns`
- `${this.baseUrl}/events/${eventId}/addOns/${addOnId}`
- `${this.baseUrl}/events/${eventId}/addOns/${addOnId}/delete`

### ./src/app/rest-services/add-ons/add-on-service.module.ts

Classes: AddOnServiceModule

### ./src/app/rest-services/add-ons/add-on.service.factory.ts


### ./src/app/rest-services/add-ons/add-on.service.ts

Classes: AddOnService

### ./src/app/rest-services/add-ons/factory/add-on.factory.ts

Classes: AddOnFactory
Methods: private buildAttraction, public fromAddOnSetting

### ./src/app/rest-services/attraction/attraction-rest.service.mock.ts

Classes: AttractionRestServiceMock
Methods: public findAttractionsByKeyword, public getAttractionById

### ./src/app/rest-services/attraction/attraction-rest.service.ts

Classes: AttractionRestService
Methods: private executeRequest, public findAttractionsByKeyword, public getAttractionById
Endpoints:
- `${this.baseUrl}/eventbase/rest/ui/v1/attractions?countryCode=${encodeURIComponent(countryCode)}&keyword=${encodeURIComponent(keyword)}&isUpsellEvent=${encodeURIComponent(isUpsellEvent)}`
- `${this.baseUrl}/eventbase/rest/ui/v1/attractions/${id}`

### ./src/app/rest-services/attraction/attraction.service.factory.ts


### ./src/app/rest-services/attraction/attraction.service.ts

Classes: AttractionService

### ./src/app/rest-services/audit/audit-rest.service.mock.ts

Classes: AuditRestServiceMock
Methods: private buildCreateEvent, private buildCreateOffer, private buildMoveSelectioToHold, private buildPricingAndFees, private buildSectionAvailabilityAndChannels, private buildSectionDetails, private buildSectionDiscreetLinks, private buildSectionInventory, private buildSectionPricingAndFees, private buildSectionPromoCodes, private buildSectionTicketLimits, private formatDateTime, public getAuditLog, public getAuditLogSeatDetail

### ./src/app/rest-services/audit/audit-rest.service.ts

Classes: AuditRestService
Methods: public getAuditLog, public getAuditLogSeatDetail
Endpoints:
- `${this.baseUrl}/audit/${eventId}?pageNumber=${pageNumber}`
- `${this.baseUrl}/audit/${eventId}/details/${auditLogEntryId}`

### ./src/app/rest-services/audit/audit.service.factory.ts


### ./src/app/rest-services/audit/audit.service.ts

Classes: AuditService

### ./src/app/rest-services/auth-token/auth-token-rest.service.ts

Classes: AuthTokenImplService
Methods: public init, public refresh
Endpoints:
- `${this.baseUrl}/token/refresh/${eventId}`

### ./src/app/rest-services/auth-token/auth-token.service.factory.ts


### ./src/app/rest-services/auth-token/auth-token.service.mock.ts

Classes: AuthTokenMockService
Methods: public init, public refresh

### ./src/app/rest-services/auth-token/auth-token.service.ts

Classes: AuthTokenService

### ./src/app/rest-services/authorization/authorization-rest.service.mock.ts

Classes: AuthorizationServiceMock
Methods: public getClientAccessControlList, public getEventAccessControlList, public getOrganizationControlList, public getVenueAccessControlList

### ./src/app/rest-services/authorization/authorization-rest.service.ts

Classes: AuthorizationRestService
Methods: public getClientAccessControlList, public getEventAccessControlList, public getOrganizationControlList, public getVenueAccessControlList

### ./src/app/rest-services/authorization/authorization-service.ts

Classes: AuthorizationService

### ./src/app/rest-services/authorization/authorization.service.factory.ts


### ./src/app/rest-services/backend-routes.provider.ts

Classes: BackendRoutesProvider
Methods: public constructor, public getBackendAccessTokenUrl, public getEventbaseBackendUrl, public getTctBackendUrl, public getWebSocketUrl
Endpoints:
- `/api/events`
- `/api/tct/render`

### ./src/app/rest-services/classification/classification-rest.service.mock.ts

Classes: ClassificationRestServiceMock
Methods: public getClassifications, public updateEventClassification

### ./src/app/rest-services/classification/classification-rest.service.ts

Classes: ClassificationRestService
Methods: public getClassifications, public updateEventClassification
Endpoints:
- `${this.baseUrl}/events/${eventId}/updateEventClassification`
- `${this.baseUrl}/events/classifications`

### ./src/app/rest-services/classification/classification.service.factory.ts


### ./src/app/rest-services/classification/classification.service.ts

Classes: ClassificationService

### ./src/app/rest-services/client-settings/add-on-org-privileges/add-on-org-privileges-rest.service.ts

Classes: AddOnOrgPrivilegesRestService
Methods: public addOrgPrivileges, public deleteOrgPrivileges
Endpoints:
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/organizationPrivileges/${orgPrivilegesId}`

### ./src/app/rest-services/client-settings/add-on-org-privileges/add-on-org-privileges.service.factory.ts


### ./src/app/rest-services/client-settings/add-on-org-privileges/add-on-org-privileges.service.mock.ts

Classes: AddOnOrgPrivilegesServiceMock
Methods: public addOrgPrivileges, public deleteOrgPrivileges

### ./src/app/rest-services/client-settings/add-on-org-privileges/add-on-org-privileges.service.ts

Classes: AddOnOrgPrivilegesService

### ./src/app/rest-services/client-settings/add-on-settings/add-on-settings-rest.service.ts

Classes: AddOnSettingsRestService
Methods: public addOrUpdateFinancialContracts, public createAddOnSettings, public deleteAddOnSettings, public deleteFinancialContract, public getAddOnValidationResults, public updateAddOnDetails, public updateAddOnEventDefaults, public updateAddOnSettings, public updateAddOnTicketOption, public updateFinancialContract
Endpoints:
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/addOnDetails`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/eventDefaults`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/financialContracts`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/financialContracts/${financialContract.id}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/venues/${venueId}/addOnSettings/${addOnSettingsId}/ticketOptions`
- `${this.baseUrl}/clientsetup/venue/${venueId}/event/${eventId}/addOnSettings`

### ./src/app/rest-services/client-settings/add-on-settings/add-on-settings.service.factory.ts


### ./src/app/rest-services/client-settings/add-on-settings/add-on-settings.service.mock.ts

Classes: AddOnSettingsServiceMock
Methods: public addOrUpdateFinancialContracts, public createAddOnSettings, public deleteAddOnSettings, public deleteFinancialContract, public getAddOnValidationResults, public updateAddOnDetails, public updateAddOnEventDefaults, public updateAddOnSettings, public updateAddOnTicketOption, public updateFinancialContract

### ./src/app/rest-services/client-settings/add-on-settings/add-on-settings.service.ts

Classes: AddOnSettingsService

### ./src/app/rest-services/client-settings/client-settings-rest.service.ts

Classes: ClientSettingsRestService
Methods: private createUpdateVenueLayoutRequest, public addEventCodePrefix, public addOrUpdateFinancialContracts, public createClientProfile, public createSystemTemplate, public deleteEventCodePrefix, public deleteFinancialContract, public deleteQualifierCatalog, public deleteSystemTemplate, public disableFeature, public enableFeature, public enableLayout, public getAssociatedClientProfile, public getClientProfile, public getClientProfileByOrganizationAndVenue, public getClients, public getIsmOnboardingValidationResults, public importHostPublicationSettings, public importQualifierCatalog, public onboardClientToCreate, public renameQualifierCatalog, public searchCasScenarios, public searchClients, public setDefaultEventCodePrefix, public updateAgeRestriction, public updateAllInPricingIncludedInDisplay, public updateArchticsSettingEnabled, public updateBestAvailable, public updateContactEmail, public updateContactName, public updateDefaultFacilityFee, public updateDefaultFacilityFeeSettings, public updateDoorsTimeOffset, public updateEnhancedGeneralAdmissionEnabled, public updateEventCodeDateFormat, public updateFacilityFeeIncludedInDisplay, public updateFacilityFeeIncludedInTaxes, public updateFinancialContract, public updateGeneralOffsaleOffset, public updateIncludedTaxesPercentage, public updateMfxVenueId, public updateMusicServices, public updatePromotersSettings, public updateSeatsByRequest, public updateServiceChargeIncludedInDisplay, public updateServiceChargeTax, public updateTicketLimit, public updateValueAddedTax, public updateVenueLayoutSettings, public validateIsmOnboarding
Endpoints:
- `${this.baseUrl}/clientsetup/${eventId}/client`
- `${this.baseUrl}/clientsetup/${venueLayoutSettings.clientId}/venueLayoutSettings`
- `${this.baseUrl}/clientsetup/client/${clientId}/layout/${layoutId}/enabled?organizationId=${organizationId}`
- `${this.baseUrl}/clientsetup/clients`
- `${this.baseUrl}/clientsetup/clients?keyword=${encodeURIComponent(venueKeyword)}`
- `${this.baseUrl}/clientsetup/clients/${clientId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/ageRestriction`
- `${this.baseUrl}/clientsetup/clients/${clientId}/allInPricingIncludedInDisplay?venueId=${venueId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/archticsSetting`
- `${this.baseUrl}/clientsetup/clients/${clientId}/bestAvailableSetting`
- `${this.baseUrl}/clientsetup/clients/${clientId}/contacts/${contactType}/email`
- `${this.baseUrl}/clientsetup/clients/${clientId}/contacts/${contactType}/name`
- `${this.baseUrl}/clientsetup/clients/${clientId}/currentStage?organizationId=${organizationId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/doorsTimeOffset`
- `${this.baseUrl}/clientsetup/clients/${clientId}/enhancedGeneralAdmissionSetting`
- `${this.baseUrl}/clientsetup/clients/${clientId}/eventCodeDateFormat`
- `${this.baseUrl}/clientsetup/clients/${clientId}/facilityFee`
- `${this.baseUrl}/clientsetup/clients/${clientId}/facilityFeeIncludedInDisplay`
- `${this.baseUrl}/clientsetup/clients/${clientId}/facilityFeeIncludedInTaxes`
- `${this.baseUrl}/clientsetup/clients/${clientId}/facilityFeeSettings`
- `${this.baseUrl}/clientsetup/clients/${clientId}/features/${settingFeatureName}/disable`
- `${this.baseUrl}/clientsetup/clients/${clientId}/features/${settingFeatureName}/enable`
- `${this.baseUrl}/clientsetup/clients/${clientId}/financialContracts`
- `${this.baseUrl}/clientsetup/clients/${clientId}/financialContracts/${financialContract.id}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/financialContracts/${financialContractId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/hostPublicationSettings?eventId=${eventId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/includedTaxesPercentage`
- `${this.baseUrl}/clientsetup/clients/${clientId}/mfxPublicationSettings/mfxVenueId`
- `${this.baseUrl}/clientsetup/clients/${clientId}/musicServices`
- `${this.baseUrl}/clientsetup/clients/${clientId}/offsaleOffset`
- `${this.baseUrl}/clientsetup/clients/${clientId}/prefixes`
- `${this.baseUrl}/clientsetup/clients/${clientId}/prefixes/${prefixId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/prefixes/${prefixId}/default`
- `${this.baseUrl}/clientsetup/clients/${clientId}/promoters`
- `${this.baseUrl}/clientsetup/clients/${clientId}/qualifierCatalog?venueId=${venueId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/qualifierCatalog/${qualifierCatalogId}?venueId=${venueId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/qualifierCatalog/import?venueId=${venueId}`
- `${this.baseUrl}/clientsetup/clients/${clientId}/seatsByRequestSetting`
- `${this.baseUrl}/clientsetup/clients/${clientId}/serviceChargeIncludedInDisplay`
- `${this.baseUrl}/clientsetup/clients/${clientId}/serviceChargeTax`
- `${this.baseUrl}/clientsetup/clients/${clientId}/ticketLimit`
- `${this.baseUrl}/clientsetup/clients/${clientId}/valueAddedTax`
- `${this.baseUrl}/clientsetup/clients/${organizationId}/${venueId}`
- `${this.baseUrl}/clientsetup/ismOnboarding/validate`
- `${this.baseUrl}/clientsetup/ismOnboarding/validation/${ismOnboardingValidationId}/results`
- `${this.baseUrl}/clientsetup/operations/search/casScenario?keyword=${encodeURIComponent(keyword)}`
- `${this.baseUrl}/clientsetup/systemTemplate?venueId=${venueId}&organizationId=${organizationId}`
- `${this.baseUrl}/clientsetup/systemTemplate/${systemTemplateId}?venueId=${venueId}&organizationId=${organizationId}`

### ./src/app/rest-services/client-settings/client-settings.service.factory.ts


### ./src/app/rest-services/client-settings/client-settings.service.mock.ts

Classes: ClientSettingsRestServiceMock
Methods: public addEventCodePrefix, public addOrUpdateFinancialContracts, public createClientProfile, public createSystemTemplate, public deleteEventCodePrefix, public deleteFinancialContract, public deleteQualifierCatalog, public deleteSystemTemplate, public disableFeature, public enableFeature, public enableLayout, public getAssociatedClientProfile, public getClientProfile, public getClientProfileByOrganizationAndVenue, public getClients, public getIsmOnboardingValidationResults, public importHostPublicationSettings, public importQualifierCatalog, public onboardClientToCreate, public renameQualifierCatalog, public searchCasScenarios, public searchClients, public setDefaultEventCodePrefix, public updateAgeRestriction, public updateAllInPricingIncludedInDisplay, public updateArchticsSettingEnabled, public updateBestAvailable, public updateContactEmail, public updateContactName, public updateDefaultFacilityFee, public updateDefaultFacilityFeeSettings, public updateDoorsTimeOffset, public updateEnhancedGeneralAdmissionEnabled, public updateEventCodeDateFormat, public updateFacilityFeeIncludedInDisplay, public updateFacilityFeeIncludedInTaxes, public updateFinancialContract, public updateGeneralOffsaleOffset, public updateIncludedTaxesPercentage, public updateMfxVenueId, public updateMusicServices, public updatePromotersSettings, public updateSeatsByRequest, public updateServiceChargeIncludedInDisplay, public updateServiceChargeTax, public updateTicketLimit, public updateValueAddedTax, public updateVenueLayoutSettings, public validateIsmOnboarding

### ./src/app/rest-services/client-settings/client-settings.service.ts

Classes: ClientSettingsService

### ./src/app/rest-services/client-settings/model/cas-search-result.ts


### ./src/app/rest-services/client-settings/model/ism-validation-category-results.ts


### ./src/app/rest-services/collaboration/collaboration-rest.service.mock.ts

Classes: CollaborationRestServiceMock
Methods: public acknowledgeMessages, public addMemberToTeam, public changeRequestStatus, public constructor, public findTeamByEventId, public getMessages, public removeMemberFromTeam, public searchUserByName, public sendMessage, public setRecapEmailsSubscription

### ./src/app/rest-services/collaboration/collaboration-rest.service.ts

Classes: CollaborationRestService
Methods: public acknowledgeMessages, public addMemberToTeam, public changeRequestStatus, public findTeamByEventId, public getMessages, public removeMemberFromTeam, public searchUserByName, public sendMessage, public setRecapEmailsSubscription
Endpoints:
- `${this.baseUrl}/${eventId}/searchUser?username=${encodeURIComponent(userName)}`
- `${this.baseUrl}/${eventId}/team`
- `${this.baseUrl}/${eventId}/team/add`
- `${this.baseUrl}/${eventId}/team/member/${memberId}/recapEmailsSubscription`
- `${this.baseUrl}/${eventId}/team/messages`
- `${this.baseUrl}/${eventId}/team/messages/acknowledge`
- `${this.baseUrl}/${eventId}/team/remove`
- `${this.baseUrl}/${eventId}/team/request/${id}/resolve`

### ./src/app/rest-services/collaboration/collaboration.service.factory.ts


### ./src/app/rest-services/collaboration/collaboration.service.ts

Classes: CollaborationService

### ./src/app/rest-services/customimage/custom-image-rest.service.mock.ts

Classes: CustomImageRestServiceMock
Methods: public createUploadHistoryEntry, public deleteEventImageAugmentation, public deleteEventLevelImage, public getImage, public uploadImage, public validateImage

### ./src/app/rest-services/customimage/custom-image-rest.service.ts

Classes: CustomImageRestService
Methods: public createUploadHistoryEntry, public deleteEventImageAugmentation, public deleteEventLevelImage, public getImage, public uploadImage, public validateImage
Endpoints:
- `${this.baseUrl}/events/customImage/${eventId}`
- `${this.baseUrl}/events/customImage/${eventId}/delete-augmentation`
- `${this.baseUrl}/events/customImage/${eventId}/upload`
- `${this.baseUrl}/events/customImage/${eventId}/upload/history`
- `${this.baseUrl}/events/customImage/validate`

### ./src/app/rest-services/customimage/custom-image.service.factory.ts


### ./src/app/rest-services/customimage/custom-image.service.ts

Classes: CustomImageService

### ./src/app/rest-services/discrete-links/discrete-links-rest.service.mock.ts

Classes: DiscreteLinksRestServiceMock
Methods: public deleteDiscreteLink, public offerAddDiscreteLink, public offerLinkDiscreteLink, public offerUnlinkDiscreteLink, public updateDiscreteLink

### ./src/app/rest-services/discrete-links/discrete-links-rest.service.ts

Classes: DiscreteLinksRestService
Methods: public deleteDiscreteLink, public offerAddDiscreteLink, public offerLinkDiscreteLink, public offerUnlinkDiscreteLink, public updateDiscreteLink
Endpoints:
- `${this.baseUrl}/events/${eventId}/discreteLinks/${discreteLink.id}`
- `${this.baseUrl}/events/${eventId}/discreteLinks/${discreteLinkId}/delete`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/discreteLinks/${discreteLink.id}`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/discreteLinks/${discreteLinkId}/link`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/discreteLinks/${discreteLinkId}/unlink`

### ./src/app/rest-services/discrete-links/discrete-links.service.factory.ts


### ./src/app/rest-services/discrete-links/discrete-links.service.ts

Classes: DiscreteLinksService

### ./src/app/rest-services/event/event-activity-rest.service.ts

Classes: EventActivityRestService
Methods: public listPendingEvent
Endpoints:
- `${this.baseUrl}/events/pendingPublish`

### ./src/app/rest-services/event/event-activity.service.factory.ts


### ./src/app/rest-services/event/event-activity.service.mock.ts

Classes: EventActivityServiceMock
Methods: public listPendingEvent

### ./src/app/rest-services/event/event-activity.service.ts

Classes: EventActivityService

### ./src/app/rest-services/event/event-config-rest.service.mock.ts

Classes: EventConfigServiceMock
Methods: public addOrganizationPrivileges, public deleteOrganizationPrivileges, public updateEventCodePrefix, public updateEventCodeSuffix, public updateEventCodeType, public updateFacilityFee, public updateFacilityFees, public updateOptionalRoll, public updateQualifierCatalog, public updateSettlementCode

### ./src/app/rest-services/event/event-config-rest.service.ts

Classes: EventConfigRestService
Methods: public addOrganizationPrivileges, public deleteOrganizationPrivileges, public updateEventCodePrefix, public updateEventCodeSuffix, public updateEventCodeType, public updateFacilityFee, public updateFacilityFees, public updateOptionalRoll, public updateQualifierCatalog, public updateSettlementCode
Endpoints:
- `${this.baseUrl}/events/${eventId}/eventCodePrefix`
- `${this.baseUrl}/events/${eventId}/eventCodeSuffix`
- `${this.baseUrl}/events/${eventId}/eventCodeType`
- `${this.baseUrl}/events/${eventId}/optionalRoll`
- `${this.baseUrl}/events/${eventId}/organizationsPrivileges`
- `${this.baseUrl}/events/${eventId}/organizationsPrivileges/${request.organizationCode}/delete`
- `${this.baseUrl}/events/${eventId}/qualifierCatalog`
- `${this.baseUrl}/events/${eventId}/updateFacilityFee`
- `${this.baseUrl}/events/${eventId}/updateFacilityFees`
- `${this.baseUrl}/events/${eventId}/updateSettlementCode`

### ./src/app/rest-services/event/event-config.service.factory.ts


### ./src/app/rest-services/event/event-config.service.ts

Classes: EventConfigService

### ./src/app/rest-services/event/event-list-rest.service.mock.ts

Classes: EventListRestServiceMock
Methods: public fetchList

### ./src/app/rest-services/event/event-list-rest.service.ts

Classes: EventListRestService
Methods: private buildQueryParameters, private convertToEventList, private generateUrlFromInfo, public constructor, public fetchList

### ./src/app/rest-services/event/event-list.service.factory.ts


### ./src/app/rest-services/event/event-list.service.ts

Classes: EventListService

### ./src/app/rest-services/event/event.rest-service.factory.ts


### ./src/app/rest-services/event/event.rest-service.mock.ts

Classes: EventRestServiceMock
Methods: private createEvent, private getMock, private getMockEvent, public check, public create, public createTemplate, public delete, public duplicate, public getSystemTemplateSettlementCode, public listEventTemplates, public loadEvent, public loadStandaloneEvent, public requestPublish, public requestUpdateOnsaleDate, public requestUpdatePerformanceDate, public rescheduleEvent, public saveAsTemplate, public updateAgeRestriction, public updateAttractions, public updateDoorsTime, public updateEventInfo, public updateEventVisibilityDate, public updateFees, public updateOnsaleDate, public updatePerformanceDate, public updatePromoters, public updateReportFlags, public updateTicketTexts, public validateMarketedEvent
Endpoints:
- `${this.baseUrl}${path}`

### ./src/app/rest-services/event/event.rest-service.ts

Classes: EventRestService
Methods: public check, public create, public createTemplate, public delete, public duplicate, public getSystemTemplateSettlementCode, public listEventTemplates, public loadEvent, public loadStandaloneEvent, public requestPublish, public requestUpdateOnsaleDate, public requestUpdatePerformanceDate, public rescheduleEvent, public saveAsTemplate, public updateAgeRestriction, public updateAttractions, public updateDoorsTime, public updateEventInfo, public updateEventVisibilityDate, public updateFees, public updateOnsaleDate, public updatePerformanceDate, public updatePromoters, public updateReportFlags, public updateTicketTexts, public validateMarketedEvent
Endpoints:
- `${this.baseUrl}/events/${encodeURIComponent(eventId)}`
- `${this.baseUrl}/events/${encodeURIComponent(eventId)}/id`
- `${this.baseUrl}/events/${eventId}`
- `${this.baseUrl}/events/${eventId}?venueId=${venueId}&eventType=${eventType}`
- `${this.baseUrl}/events/${eventId}/fees/update`
- `${this.baseUrl}/events/${eventId}/promoters`
- `${this.baseUrl}/events/${eventId}/reporting/reportFlags`
- `${this.baseUrl}/events/${eventId}/requestOnsaleUpdate`
- `${this.baseUrl}/events/${eventId}/requestPerformanceDateUpdate`
- `${this.baseUrl}/events/${eventId}/requestPublish`
- `${this.baseUrl}/events/${eventId}/reschedule`
- `${this.baseUrl}/events/${eventId}/standalone`
- `${this.baseUrl}/events/${eventId}/updateAgeRestriction`
- `${this.baseUrl}/events/${eventId}/updateAttractions`
- `${this.baseUrl}/events/${eventId}/updateDoorsTime`
- `${this.baseUrl}/events/${eventId}/updateEventInfo`
- `${this.baseUrl}/events/${eventId}/updateOnsaleDate`
- `${this.baseUrl}/events/${eventId}/updatePerformanceDate`
- `${this.baseUrl}/events/${eventId}/updateTicketTexts`
- `${this.baseUrl}/events/${eventId}/validateMarketedEvent`
- `${this.baseUrl}/events/${eventId}/visibilityDate`
- `${this.baseUrl}/events/${sourceEventId}/duplicate`
- `${this.baseUrl}/events/${ticketingSubsystemId}/${systemEventId}/settlementCode`
- `${this.baseUrl}/events/templates`
- `${this.baseUrl}/events/templates?venueId=${encodeURIComponent(venueId)}`
- `${this.baseUrl}/events/templates?venueId=${request.venueId}`

### ./src/app/rest-services/event/event.service.ts

Classes: EventService

### ./src/app/rest-services/fees/fee-analytics.service.ts

Classes: FeeAnalyticsService
Methods: private getEventId, public trackServiceFeeEstimation

### ./src/app/rest-services/fees/fee-blueprint.mock.service.ts

Classes: FeeBlueprintMockService
Methods: public getForEvent, public getForEventAndFinancialContract

### ./src/app/rest-services/fees/fee-blueprint.model.ts


### ./src/app/rest-services/fees/fee-blueprint.rest.service.ts

Classes: FeeBlueprintRestService
Methods: private executeRequest, public getForEvent, public getForEventAndFinancialContract
Endpoints:
- `${this.baseUrl}/events/${eventId}/feeBlueprint`
- `${this.baseUrl}/events/${eventId}/feeBlueprint/${financialContractId}`

### ./src/app/rest-services/fees/fee-blueprint.service.factory.ts


### ./src/app/rest-services/fees/fee-blueprint.service.ts

Classes: FeeBlueprintService

### ./src/app/rest-services/fees/fee-calculator.ts

Classes: FeeCalculator
Methods: private computeDifference, private computeTotal, private evaluateFormula, private refineBaseAmount, public calculateBaseAmount, public calculateTotal

### ./src/app/rest-services/fees/fee-rounder.ts

Classes: FeeRounder
Methods: private roundHalfUp, private roundUpToStep, public round

### ./src/app/rest-services/fees/fees.module.ts

Classes: FeesModule

### ./src/app/rest-services/fees/price-range-matcher.ts

Classes: PriceRangeMatcher
Methods: private findMatchingAnyOfferTypeAndInRange, private findMatchingOfferTypeAndInRange, private findPriceRange, private getResolvedPrice, private isInPriceRange, private isMatchingOfferType, public findMatchingPriceRange

### ./src/app/rest-services/inventory/allocation/allocation-rest.service.mock.ts

Classes: AllocationRestServiceMock
Methods: public removeSelections, public updateColor

### ./src/app/rest-services/inventory/allocation/allocation-rest.service.ts

Classes: AllocationRestService
Methods: public removeSelections, public updateColor
Endpoints:
- `${this.baseUrl}/inventories/${inventoryId}/allocations/${allocationId}/color`
- `${this.baseUrl}/inventories/${inventoryId}/removeSelections`

### ./src/app/rest-services/inventory/allocation/allocation.service.factory.ts


### ./src/app/rest-services/inventory/allocation/allocation.service.ts

Classes: AllocationService

### ./src/app/rest-services/inventory/inventory-rest.service.ts

Classes: InventoryRestService
Methods: private buildMoveSelectionAllocationRequest, private buildSelectionDispatchRequest, private moveSelection, private removeActionSelections, public getInventory, public moveSelectionToAllocation, public moveSelectionToAttribute, public moveSelectionToOpen, public moveSelectionToPriceLevel, public moveSelectionToPricingType, public moveSelectionToUnassigned, public synchronizeCatalog
Endpoints:
- `${this.baseUrl}/events/${eventId}/inventory`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/allocation/${targetId}`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/attribute/${attributeId}`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/priceLevel/${priceLevelId}`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/pricingType/${pricingTypeId}`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/standardOfferAllocation`
- `${this.baseUrl}/events/${eventId}/inventory/moveSelection/unassignedPriceLevel`
- `${this.baseUrl}/events/${eventId}/inventory/synchronizeAllocations`

### ./src/app/rest-services/inventory/inventory.service.factory.ts


### ./src/app/rest-services/inventory/inventory.service.mock.ts

Classes: InventoryMockService
Methods: public getInventory, public moveSelectionToAllocation, public moveSelectionToAttribute, public moveSelectionToOpen, public moveSelectionToPriceLevel, public moveSelectionToPricingType, public moveSelectionToUnassigned, public synchronizeCatalog

### ./src/app/rest-services/inventory/inventory.service.ts

Classes: InventoryService

### ./src/app/rest-services/inventory/priceLevel/event-price-level-rest.service.ts

Classes: EventPriceLevelRestService
Methods: public updatePrice
Endpoints:
- `${this.baseUrl}/events/${eventId}/priceLevels/${priceLevelId}/reprice`

### ./src/app/rest-services/inventory/priceLevel/price-level-rest.service.mock.ts

Classes: PriceLevelRestServiceMock
Methods: public createPriceLevel, public deletePriceLevel, public reorder, public updateColor, public updateName, public updatePrice

### ./src/app/rest-services/inventory/priceLevel/price-level-rest.service.ts

Classes: PriceLevelRestService
Methods: public createPriceLevel, public deletePriceLevel, public reorder, public updateColor, public updateName, public updatePrice
Endpoints:
- `${this.baseUrl}/v1/scenario/${inventoryId}/price_zone/${toDeletePriceLevelIndex}/delete`
- `${this.baseUrl}/v1/scenario/${scenarioId}/price_level/${priceLevelUUID}/color`
- `${this.baseUrl}/v1/scenario/${scenarioId}/price_zone/${index}`
- `${this.baseUrl}/v1/scenario/${scenarioId}/price_zone/${priceLevelIndex}/name`
- `${this.baseUrl}/v1/scenario/${scenarioId}/price_zone/${priceLevelIndex}/reorder/${destPriceLevelIndex}`

### ./src/app/rest-services/inventory/priceLevel/price-level.service.factory.ts


### ./src/app/rest-services/inventory/priceLevel/price-level.service.ts

Classes: PriceLevelService

### ./src/app/rest-services/inventory/pricing/pricing-rest.service.ts

Classes: PricingRestService
Methods: public getPricing, public getPricingRecommendations
Endpoints:
- `${this.baseUrl}/events/${eventId}/autoscaling`
- `${this.baseUrl}/events/${eventId}/autoscaling/recommendations`

### ./src/app/rest-services/inventory/pricing/pricing.service.factory.ts


### ./src/app/rest-services/inventory/pricing/pricing.service.mock.ts

Classes: PricingMockService
Methods: public getPricing, public getPricingRecommendations

### ./src/app/rest-services/inventory/pricing/pricing.service.ts

Classes: PricingService

### ./src/app/rest-services/inventory/seatStatus/seat-status-request.factory.ts

Classes: SeatStatusRequestFactory
Methods: private getMoveTargetId, private hasMoveTargetId, public buildCreateHoldRequest, public buildDeleteHoldRequest

### ./src/app/rest-services/inventory/seatStatus/seat-status-rest.service.mock.ts

Classes: SeatStatusRestServiceMock
Methods: public createAllocationGroup, public createSeatStatus, public deleteAllocationGroup, public deleteSeatStatus, public updateAllocationGroupName, public updateAllocationGroupType, public updateName

### ./src/app/rest-services/inventory/seatStatus/seat-status-rest.service.ts

Classes: SeatStatusRestService
Methods: public createAllocationGroup, public createSeatStatus, public deleteAllocationGroup, public deleteSeatStatus, public updateAllocationGroupName, public updateAllocationGroupType, public updateName
Endpoints:
- `${this.baseUrl}/inventories/${deleteHoldRequest.inventoryId}/holds/${deleteHoldRequest.deletedHoldId}/delete`
- `${this.baseUrl}/inventories/${inventoryId}/allocationGroups`
- `${this.baseUrl}/inventories/${inventoryId}/allocationGroups/${action.allocationGroupId}/type`
- `${this.baseUrl}/inventories/${inventoryId}/allocationGroups/${request.allocationGroup.id}/name`
- `${this.baseUrl}/inventories/${inventoryId}/allocationGroups/${request.allocationGroupId}/delete`
- `${this.baseUrl}/inventories/${inventoryId}/holds/${request.id}/name`
- `${this.baseUrl}/inventories/${inventoryId}/holds/${seatStatusId}`

### ./src/app/rest-services/inventory/seatStatus/seat-status.service.factory.ts


### ./src/app/rest-services/inventory/seatStatus/seat-status.service.module.ts

Classes: SeatStatusServiceModule

### ./src/app/rest-services/inventory/seatStatus/seat-status.service.ts

Classes: SeatStatusService

### ./src/app/rest-services/logging/logging-rest.service.mock.ts

Classes: LoggingRestServiceMock
Methods: public error, public info, public warn

### ./src/app/rest-services/logging/logging-rest.service.ts

Classes: LoggingRestService
Methods: private buildHeaders, private resolveCorrelationId, private send, private transform, private userAgentIsRigor, public error, public info, public warn

### ./src/app/rest-services/logging/logging.service.factory.ts


### ./src/app/rest-services/logging/logging.service.ts

Classes: LoggingService

### ./src/app/rest-services/metadata/metadata-rest.service.mock.ts

Classes: MetadataRestServiceMock
Methods: public getMetadata

### ./src/app/rest-services/metadata/metadata-rest.service.ts

Classes: MetadataRestService
Methods: public getMetadata
Endpoints:
- `${this.baseUrl}/events/${eventId}/metadata`

### ./src/app/rest-services/metadata/metadata.service.factory.ts


### ./src/app/rest-services/metadata/metadata.service.ts

Classes: MetadataService

### ./src/app/rest-services/offer-pricing/offer-pricing-rest.service.mock.ts

Classes: OfferPricingRestServiceMock
Methods: public updatePrices

### ./src/app/rest-services/offer-pricing/offer-pricing-rest.service.ts

Classes: OfferPricingRestService
Methods: public updatePrices
Endpoints:
- `${this.baseUrl}/events/${eventId}/offerPricings/update`

### ./src/app/rest-services/offer-pricing/offer-pricing.service.factory.ts


### ./src/app/rest-services/offer-pricing/offer-pricing.service.ts

Classes: OfferPricingService

### ./src/app/rest-services/offer/model/factory/publish-offer-request.factory.ts

Classes: PublishOfferRequestFactory
Methods: private getAllocationNamesById, private getAllocations, private getAllocationShortNamesById, private getPresale, private getPricing, public create

### ./src/app/rest-services/offer/offer-inventory-rest.service.mock.ts

Classes: OfferInventoryRestServiceMock

### ./src/app/rest-services/offer/offer-inventory-rest.service.ts

Classes: OfferInventoryRestService
Methods: public addAllocationOfferAssociation, public removeAllocationOfferAssociation, public replaceOfferAllocation, public updateAllocationName, public updateAllocationShortName, public updateInventoryType, public updateOfferAllocationType
Endpoints:
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/allocations/${allocationId}/association`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/allocations/${request.allocationId}/association/delete`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/allocations/${request.allocationId}/name`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/allocations/${request.allocationId}/shortName`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/inventoryType`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/replaceAllocation`
- `${this.baseUrl}/events/${eventId}/offers/${request.offerId}/updateAllocationType`

### ./src/app/rest-services/offer/offer-inventory.service.factory.ts


### ./src/app/rest-services/offer/offer-inventory.service.ts

Classes: OfferInventoryService

### ./src/app/rest-services/offer/offer-rest.module.ts

Classes: OfferRestModule

### ./src/app/rest-services/offer/offer-rest.service.mock.ts

Classes: OfferRestServiceMock
Methods: public addPassword, public createOffer, public deleteOffer, public deletePassword, public editPassword, public linkOfferToPricing, public listOffers, public publish, public setOfferCustomDate, public synchronizeSalesChannels, public unlinkOfferFromPricing, public updateAbsolutePricing, public updateAvailability, public updateDescription, public updateMinimumPrice, public updateMoreInfoLinkText, public updateMoreInfoLinkUrl, public updateName, public updateOffer, public updateOfferPrivacy, public updateOfferSalesChannelEnabled, public updateOfferSalesChannelRole, public updateOfferTranslatableItemInfos, public updatePasswordRolledUp, public updatePasswords, public updatePriceLevelPriceType, public updatePricing, public updateReportingGroupId, public updateRepricingType, public updateRoundingIncrement, public updateRoundingType, public updateShortName, public updateSystemOfferType, public updateTicketLimits, public validate

### ./src/app/rest-services/offer/offer-rest.service.ts

Classes: OfferRestService
Methods: public addPassword, public createOffer, public deleteOffer, public deletePassword, public editPassword, public linkOfferToPricing, public listOffers, public publish, public setOfferCustomDate, public synchronizeSalesChannels, public unlinkOfferFromPricing, public updateAbsolutePricing, public updateAvailability, public updateDescription, public updateMinimumPrice, public updateMoreInfoLinkText, public updateMoreInfoLinkUrl, public updateName, public updateOffer, public updateOfferPrivacy, public updateOfferSalesChannelEnabled, public updateOfferSalesChannelRole, public updateOfferTranslatableItemInfos, public updatePasswordRolledUp, public updatePasswords, public updatePriceLevelPriceType, public updatePricing, public updateReportingGroupId, public updateRepricingType, public updateRoundingIncrement, public updateRoundingType, public updateShortName, public updateSystemOfferType, public updateTicketLimits, public validate
Endpoints:
- `${this.baseUrl}/events/${eventId}/offers`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/absolutePricing`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/customDate`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/delete`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/description`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/linkText`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/linkUrl`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/name`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/password`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/password/delete`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/password/edit`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/password/rolledUp`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/passwords`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/period`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/priceType`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/link`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/minimumPrice`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/reportingGroup`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/repricingType`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/roundingIncrement`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/roundingType`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/pricing/unlink`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/private`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/setSalesChannelEnabled`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/setSalesChannelRole`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/shortName`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/systemOfferType`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/ticketLimits`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/translatableItemInfos`
- `${this.baseUrl}/events/${eventId}/offers/${offerId}/update`
- `${this.baseUrl}/events/${eventId}/offers/publishOffer`
- `${this.baseUrl}/events/${eventId}/offers/synchronizeSalesChannels`
- `${this.baseUrl}/events/${eventId}/offers/validate`
- `${this.baseUrl}/events/${request.eventId}/offers/${request.offerId}`

### ./src/app/rest-services/offer/offer.service.factory.ts


### ./src/app/rest-services/offer/offer.service.ts

Classes: OfferService

### ./src/app/rest-services/organization/organization-rest.service.mock.ts

Classes: OrganizationRestServiceMock
Methods: public searchOrganizations

### ./src/app/rest-services/organization/organization-rest.service.ts

Classes: OrganizationRestService
Methods: private buildUrl, public searchOrganizations
Endpoints:
- `${this.baseUrl}/searchOrganizations`

### ./src/app/rest-services/organization/organization.service.factory.ts


### ./src/app/rest-services/organization/organization.service.ts

Classes: OrganizationService

### ./src/app/rest-services/presale/presale.rest-service.factory.ts


### ./src/app/rest-services/presale/presale.rest-service.ts

Classes: PresaleRestService
Methods: public create, public delete, public requestCreate, public requestUpdate, public update
Endpoints:
- `${this.baseUrl}/events/${eventId}/presales`
- `${this.baseUrl}/events/${eventId}/presales/${initialPresale.number}/requestUpdate`
- `${this.baseUrl}/events/${eventId}/presales/${presale.number}/delete`
- `${this.baseUrl}/events/${eventId}/presales/${presaleAfter.number}`
- `${this.baseUrl}/events/${eventId}/presales/requestCreation`

### ./src/app/rest-services/presale/presale.service.mock.ts

Classes: PresaleServiceMock
Methods: public create, public delete, public requestCreate, public requestUpdate, public update

### ./src/app/rest-services/presale/presale.service.ts

Classes: PresaleService

### ./src/app/rest-services/promoters/promoters-rest.service.mock.ts

Classes: PromotersRestServiceMock
Methods: public findPromoters

### ./src/app/rest-services/promoters/promoters-rest.service.ts

Classes: PromotersRestService
Methods: public findPromoters
Endpoints:
- `${this.baseUrl}/promoters?keyword=${encodeURIComponent(keyword ?? '')}`

### ./src/app/rest-services/promoters/promoters-service.module.ts

Classes: PromotersServiceModule

### ./src/app/rest-services/promoters/promoters.service.factory.ts


### ./src/app/rest-services/promoters/promoters.service.ts

Classes: PromotersService

### ./src/app/rest-services/publish/publish-rest.service.mock.ts

Classes: PublishRestServiceMock
Methods: public earlyPublish, public publish, public validate

### ./src/app/rest-services/publish/publish-rest.service.ts

Classes: PublishRestService
Methods: public earlyPublish, public publish, public validate
Endpoints:
- `${this.baseUrl}/events/${eventId}/earlyPublishAsync`
- `${this.baseUrl}/events/${eventId}/publishAsync`
- `${this.baseUrl}/events/${eventId}/validate`

### ./src/app/rest-services/publish/publish.service.factory.ts


### ./src/app/rest-services/publish/publish.service.ts

Classes: PublishService

### ./src/app/rest-services/reportAccessOrganization/report-access-organization-rest.service.mock.ts

Classes: ReportAccessOrganizationRestServiceMock
Methods: public search

### ./src/app/rest-services/reportAccessOrganization/report-access-organization-rest.service.ts

Classes: ReportAccessOrganizationRestService
Methods: public constructor, public search

### ./src/app/rest-services/reportAccessOrganization/report-access-organization.service.factory.ts


### ./src/app/rest-services/reportAccessOrganization/report-access-organization.service.ts

Classes: ReportAccessOrganizationService

### ./src/app/rest-services/runs/run-performance-rest.service.factory.ts


### ./src/app/rest-services/runs/run-performance-rest.service.mock.ts

Classes: RunPerformanceRestServiceMock
Methods: public loadPerformances, public updateEventCodeSuffix, public updatePerformances

### ./src/app/rest-services/runs/run-performance-rest.service.ts

Classes: RunPerformanceRestService
Methods: public loadPerformances, public updateEventCodeSuffix, public updatePerformances
Endpoints:
- `${this.baseUrl}/runs/${request.runId}/performances`
- `${this.baseUrl}/runs/${runId}/performances`
- `${this.baseUrl}/runs/${runId}/performances/${performanceId}/suffix`

### ./src/app/rest-services/runs/run-performance.service.ts

Classes: RunPerformanceService

### ./src/app/rest-services/runs/run-rest.service.factory.ts


### ./src/app/rest-services/runs/run-rest.service.mock.ts

Classes: RunRestServiceMock
Methods: private getMockEvent, public createRun, public publish

### ./src/app/rest-services/runs/run-rest.service.ts

Classes: RunRestService
Methods: public createRun, public publish
Endpoints:
- `${this.baseUrl}/runs?venueId=${venueId}`
- `${this.baseUrl}/runs/${runId}/publish`

### ./src/app/rest-services/runs/run.service.ts

Classes: RunService

### ./src/app/rest-services/sales/sales.rest-service.factory.ts


### ./src/app/rest-services/sales/sales.rest-service.mock.ts

Classes: SalesRestServiceMock
Methods: public getSalesSummary

### ./src/app/rest-services/sales/sales.rest-service.ts

Classes: SalesRestService
Methods: public getSalesSummary
Endpoints:
- `${this.baseUrl}/events/${eventId}/sales`

### ./src/app/rest-services/sales/sales.service.ts

Classes: SalesService

### ./src/app/rest-services/seat-map/seat-map.mock.service.ts

Classes: SeatMapMockService
Methods: public getAvailableSeatMaps, public selectSeatMap

### ./src/app/rest-services/seat-map/seat-map.model.ts


### ./src/app/rest-services/seat-map/seat-map.module.ts

Classes: SeatMapModule

### ./src/app/rest-services/seat-map/seat-map.rest.service.ts

Classes: SeatMapRestService
Methods: public getAvailableSeatMaps, public selectSeatMap
Endpoints:
- `${this.baseUrl}/events/${eventId}/seatMap`
- `${this.baseUrl}/events/${eventId}/seatMaps`

### ./src/app/rest-services/seat-map/seat-map.service.factory.ts


### ./src/app/rest-services/seat-map/seat-map.service.ts

Classes: SeatMapService

### ./src/app/rest-services/tct/tct-rest.service.mock.ts

Classes: TctRestServiceMock
Methods: public renderPdf

### ./src/app/rest-services/tct/tct-rest.service.ts

Classes: TctRestService
Methods: private getBase64Output, public renderPdf
Endpoints:
- `${this.baseUrl}/`

### ./src/app/rest-services/tct/tct.service.factory.ts


### ./src/app/rest-services/tct/tct.service.ts

Classes: TctService

### ./src/app/rest-services/ticket-limit/ticket-limit-mock.service.ts

Classes: TicketLimitMockService
Methods: public updateDescription, public updateGlobalLimit, public updateTicketLimit, public updateType

### ./src/app/rest-services/ticket-limit/ticket-limit-rest.service.ts

Classes: TicketLimitRestService
Methods: public updateDescription, public updateGlobalLimit, public updateTicketLimit, public updateType
Endpoints:
- `${this.baseUrl}/events/${eventId}/ticketLimit`
- `${this.baseUrl}/events/${eventId}/ticketLimit/description`
- `${this.baseUrl}/events/${eventId}/ticketLimit/globalLimit`
- `${this.baseUrl}/events/${eventId}/ticketLimit/type`

### ./src/app/rest-services/ticket-limit/ticket-limit.model.ts


### ./src/app/rest-services/ticket-limit/ticket-limit.service.factory.ts


### ./src/app/rest-services/ticket-limit/ticket-limit.service.ts

Classes: TicketLimitService

### ./src/app/rest-services/venue-configuration/ism-configuration/ism-configuration-request.factory.ts

Classes: IsmConfigurationRequestFactory
Methods: private buildGaAccessGate, private buildReservedSeatingAccessGate, private convertToVectorGeometryPlace, private createAddGeneralAdmissionSectionRequest, private createAddReservedSeatingSectionRequest, private createAddShapeSectionRequest, private createUpdateSection, private extractRemovedPlaces, private fetchPlaceNames, private fetchRowNames, private findFirstRow, private getSectionIds, private segmentToUpdateSection, private trimAccessGatePrefix, public createAddSeatsRequest, public createAddSectionRequest, public createDeleteSectionsRequest, public createRemoveSeatsRequest, public createResizeSectionRequest, public createUpdateAccessGateRequest, public createUpdateGaSectionCapacityRequest, public createUpdateSectionDescriptionRequest, public createUpdateSectionNamingRulesRequest, public createUpdateSectionsPositionRequest

### ./src/app/rest-services/venue-configuration/ism-configuration/ism-configuration-rest.service.mock.ts

Classes: IsmConfigurationRestServiceMock
Methods: public addSeats, public addSection, public deleteSections, public removeSeats, public resizeSection, public updateAccessGate, public updateGaSectionCapacity, public updateSectionNamingRules, public updateSectionsPosition, public updateSegmentDescription, public updateSegmentName

### ./src/app/rest-services/venue-configuration/ism-configuration/ism-configuration-rest.service.ts

Classes: IsmConfigurationRestService
Methods: private updateSegmentDetails, public addSeats, public addSection, public deleteSections, public removeSeats, public resizeSection, public updateAccessGate, public updateGaSectionCapacity, public updateSectionNamingRules, public updateSectionsPosition, public updateSegmentDescription, public updateSegmentName
Endpoints:
- `${this.baseUrl}/events/${eventId}/layout/segment`
- `${this.baseUrl}/events/${eventId}/layout/segment/${segmentId}`
- `${this.baseUrl}/events/${eventId}/layout/segment/${sourceId}/name`
- `${this.baseUrl}/venuelayout/${layoutId}/deleteSections`
- `${this.baseUrl}/venuelayout/${layoutId}/updateSections`

### ./src/app/rest-services/venue-configuration/ism-configuration/ism-configuration-service.factory.ts


### ./src/app/rest-services/venue-configuration/ism-configuration/ism-configuration.service.ts

Classes: IsmConfigurationService

### ./src/app/rest-services/venue-configuration/layout/layout-rest.service.mock.ts

Classes: LayoutRestServiceMock
Methods: public deleteLayout, public getLayoutList, public updateEventTypeOverride, public updateHotSpot, public updateLayoutName, public updateStaticMapId

### ./src/app/rest-services/venue-configuration/layout/layout-rest.service.ts

Classes: LayoutRestService
Methods: public deleteLayout, public getLayoutList, public updateEventTypeOverride, public updateHotSpot, public updateLayoutName, public updateStaticMapId
Endpoints:
- `${this.baseUrl}/venuelayout/${layout.id}`
- `${this.baseUrl}/venuelayout/${layout.id}/eventTypeOverride`
- `${this.baseUrl}/venuelayout/${layout.id}/name`
- `${this.baseUrl}/venuelayout/${layout.id}/staticMapId`
- `${this.baseUrl}/venuelayout/${layoutId}/hotspot`
- `${this.baseUrl}/venuelayouts?venueId=${venueId}&includeTotals=${includeTotals.toString()}`

### ./src/app/rest-services/venue-configuration/layout/layout-service.factory.ts


### ./src/app/rest-services/venue-configuration/layout/layout.service.ts

Classes: LayoutService

### ./src/app/rest-services/venue-configuration/venue-configuration-key.ts

Classes: VenueConfigurationKey
Methods: public getId, public isLayoutKey, public isMapsKey, public isValid

### ./src/app/rest-services/venue-configuration/venue-configuration-rest.service.mock.ts

Classes: VenueConfigurationRestServiceMock
Methods: public getLayout

### ./src/app/rest-services/venue-configuration/venue-configuration-rest.service.ts

Classes: VenueConfigurationRestService
Methods: public getLayout
Endpoints:
- `${this.baseUrl}/events/${eventId}/geometry`

### ./src/app/rest-services/venue-configuration/venue-configuration-service.factory.ts


### ./src/app/rest-services/venue-configuration/venue-configuration.service.ts

Classes: VenueConfigurationService

### ./src/app/rest-services/venue/venue-rest.service.mock.ts

Classes: VenueRestServiceMock
Methods: public searchByOrganizationId, public searchVenues

### ./src/app/rest-services/venue/venue-rest.service.ts

Classes: VenueRestService
Methods: private buildBaseUrl, private buildUrl, public searchByOrganizationId, public searchVenues
Endpoints:
- `${this.baseUrl}/searchVenues?applicationScope=${this.applicationScope}`

### ./src/app/rest-services/venue/venue.service.factory.ts


### ./src/app/rest-services/venue/venue.service.ts

Classes: VenueService

### ./src/app/rest-services/websocket/pako-factory.ts

Classes: PakoFactory
Methods: public get

### ./src/app/rest-services/websocket/stomp-client-factory.ts

Classes: StompClientFactory
Methods: public create

### ./src/app/rest-services/websocket/websocket.module.ts

Classes: WebSocketModule

### ./src/app/rest-services/websocket/websocket.service.ts

Classes: WebSocketService
Methods: private connect, private createWebSocket, private getWebSocketHeadersOnConnect, private inflate, private keepAlive, private manageUnsubscribe, private messageReceiver, private onConnectionFailed, private onConnectionSucceed, private reviver, private subscribeOnSocket, public getStompClient, public init, public listenOn, public send

### ./src/app/shared/rest-services/custom-http-client.service.ts

Classes: CustomHttpClient, HttpInterceptingHandler
Methods: public handle, public handle

### ./src/app/shared/rest-services/date-reviver.ts


### ./src/app/shared/rest-services/interceptors/additional-inventory-optimistic-lock.interceptor.ts

Classes: AdditionalInventoryOptimisticLockInterceptor
Methods: public constructor, public getRequestHeaderName, public getResponseHeaderName

### ./src/app/shared/rest-services/interceptors/auth-token.interceptor.ts

Classes: AuthTokenInterceptor
Methods: private getError, private shouldIgnoreUrl, private shouldIncludeEventSection, private warnIfNoEventSection, public constructor, public intercept

### ./src/app/shared/rest-services/interceptors/base-inventory-optimistic-lock.interceptor.ts

Classes: BaseInventoryOptimisticLockInterceptor
Methods: private updateInventoryVersion, protected constructor, public intercept

### ./src/app/shared/rest-services/interceptors/base-optimistic-lock.interceptor.ts

Classes: BaseOptimisticLockInterceptor
Methods: protected encodeIfMatch, protected handleEntityVersion, protected handleLastModified

### ./src/app/shared/rest-services/interceptors/event-optimistic-lock.interceptor.ts

Classes: EventOptimisticLockInterceptor
Methods: private hasEtagHeader, private updateEventVersion, public constructor, public intercept

### ./src/app/shared/rest-services/interceptors/external-event-version-interceptor.service.ts

Classes: ExternalEventVersionInterceptor
Methods: private hasEtagHeader, private updateExternalEventVersion, public constructor, public intercept, public ngOnDestroy

### ./src/app/shared/rest-services/interceptors/inventory-optimistic-lock.interceptor.ts

Classes: InventoryOptimisticLockInterceptor
Methods: public constructor, public getRequestHeaderName, public getResponseHeaderName

### ./src/app/shared/rest-services/interceptors/layout-optimistic-lock.interceptor.ts

Classes: LayoutOptimisticLockInterceptor
Methods: private hasIfMatchHeader, private updateInventoryVersion, private updateLayoutVersion, public intercept

### ./src/app/shared/rest-services/interceptors/layout.interceptor.ts

Classes: LayoutInterceptor
Methods: private generateBody, public intercept

### ./src/app/shared/rest-services/interceptors/request-options.interceptor.ts

Classes: RequestOptionsInterceptor
Methods: private getCorrelationId, public intercept

## Notes

- Use the JSON output for the full machine-readable function map.
- Expand the input source-map list as TM1 lazy-loads more bundles.
- Do not assume every extracted endpoint is safe to call without verifying auth, headers, and payload shape.
