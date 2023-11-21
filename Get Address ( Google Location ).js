onst onNavigationBack = (data) => {
        let country = "",
            city = "",
            stateName = "",
            state_abbr = "",
            postalCode = "",
            localityName = ""

        for (var i = 0; i < data.address_components.length; i++) {
            let addr = data.address_components[i];
            if (addr.types[0] == 'country')
                country = addr.long_name ? addr.long_name : "";
            if (addr.types[0] == 'locality')
                city = addr.long_name ? addr.long_name : "";
            if (addr.types[0] == 'administrative_area_level_1') {
                stateName = addr.long_name ? addr.long_name : "";
                state_abbr = addr.short_name ? addr.short_name : "";
            } if (addr.types[0] == 'postal_code')
                postalCode = addr.long_name ? addr.long_name : "";
            if (addr.types[0] == 'sublocality_level_1')
                localityName = addr.long_name ? addr.long_name : "";
        }
        setState({ ...state, cityOfResidence: city, nationality: country })
    }
