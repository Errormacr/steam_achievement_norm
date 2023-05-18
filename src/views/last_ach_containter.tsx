import React, {useCallback, useEffect, useState} from "react";

export default function USER() {
    const [personalName,
        setpersonalName] = useState("")

    // const calculateAchievementCount = useCallback(async(data_g_ach_url :
    // string[]) => { }, [get_api]);

    useEffect(useCallback(() => {
        try {} catch (err) {
            window.alert(err.message);
        }
    }, []), []);
    return (
        <div className="last_ach_container">
            {} < div id = "last_achese" > </div> </div>
    )
}