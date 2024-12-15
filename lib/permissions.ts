export enum TenantPermissions {
    CanChangeOwner = "can_change_owner",
    CanCreateForms = "can_create_forms",
    CanCreateInstitution = "can_create_institution",
    CanCreateSettings = "can_create_settings",
    CanDelete = "can_delete",
    CanEditSettings = "can_edit_settings",
    CanModifyMembers = "can_modify_members",
    CanSetSettingValue = "can_set_setting_value",
    CanUpdate = "can_update",
    CanUpdateSubscription = "can_update_subscription",
    CanView = "can_view",
    CanViewMembers = "can_view_members",
    CanViewSettings = "can_view_settings",
    CanUploadFile = "can_upload_file",
    CanViewInstitutions = "can_view_institutions"
}

export enum PermissionDomains {
    Tenant = "tenant",
    Institution = "institution"
}
