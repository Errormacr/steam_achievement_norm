import React, {useCallback, useEffect, useState} from "react";

export default function Ach_cont() {
    
    const [allAch, setAllAch] = useState([]);

    useEffect(useCallback(() => {
        try {
            const data = JSON.parse(localStorage.getItem('ach'));
            console.log(data);
            const all_ach = data.reduce((acc:any, cur:any) => {
                const arr = cur.Achievement;
                acc = acc.concat(arr);  
                return acc;    
              }, []);
            all_ach.sort((a:any,b:any)=> b.unlocktime-a.unlocktime);
            setAllAch(all_ach.slice(0, 36));
            console.log(all_ach);
        } catch (err) {
            window.alert(err.message);
        }
    }, []), []);
    return (
        <div className="last_ach_container">
             {allAch.map((ach) => (
        <img key={ach.name} src={ach.icon} alt={ach.displayName} title={`${ach.displayName}\n${ach.description}\n${ach.percent.toFixed(2)}\n${new Date(ach.unlocktime * 1000)}`} />
      ))} </div>
    )
}