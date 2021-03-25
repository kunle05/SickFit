function hasPermission(user, permissionsNeeded) {
    let matchedPermissions = user.permissions.filter(permission => 
        permissionsNeeded.includes(permission)
    );
    if(!matchedPermissions.length) {
        throw new Error(`You do not have sufficient permissions
            :${permissionsNeeded}
            You have: ${user.permissions}
        `)
    }
}

exports.hasPermission = hasPermission;