import React,{useCallback, useEffect, useState} from "react";
import {UnixTimestampToDate} from "./GameCard";
import {I18nextProvider,useTranslation} from 'react-i18next';
import i18n from 'i18next';
import './scss/Table.scss';
import { TableData, DatumClass } from './interfaces/TableData';
export default function Table(data : TableData) {
    console.log(data);
    const [game,
        setGame] = useState<DatumClass[]>([]);
    const [sortConfig,
        setSortConfig] = useState("data");
    const [allAChPage,
        setAllAchPage] = useState(Boolean);
    const {t} = useTranslation();
    useEffect(useCallback(() => {
        try {

            setAllAchPage(data.data.allAch);
            setGame(data.data.achievements);
        } catch (error) {
            window.alert(error.message);
        }
    }, [allAChPage, allAChPage]), []);
    
    const achSort = game.sort((a : DatumClass, b : DatumClass) => {
        switch (sortConfig) {
            case "namerev":
                return a
                    .displayName
                    .localeCompare(b.displayName);
            case "name":
                return b
                    .displayName
                    .localeCompare(a.displayName);
            case "descRev":
                return a
                    .description
                    .localeCompare(b.description); 
            case "desc":
                return b
                    .description
                    .localeCompare(a.description);
            case "procrev":
                return a.percent - b.percent;
            case "proc":
                return b.percent - a.percent;
            case "datarev":
                if (a.unlocktime === 0) {
                    return 1;
                }
                if (b.unlocktime === 0) {
                    return -1;
                }
                return a.unlocktime - b.unlocktime;
            case "data":
                if (a.unlocktime === 0) {
                    return 1;
                }
                if (b.unlocktime === 0) {
                    return -1;
                }
                return b.unlocktime - a.unlocktime;
            case "unlockedRev":
                return a.achieved - b.achieved;
            case "unlocked":
                return b.achieved - a.achieved;
            default:
                return 0;
        }
    });

    const sortOptions = [

        {
            value: 'name',
            label: t('Name'),
            revValue: 'namerev'
        }, {
            value: 'desc',
            label: t('Description'),
            revValue: 'descRev'
        }, {
            value: 'proc',
            label: t('PercentPlayer'),
            revValue: 'procrev'
        }, {
            value: 'data',
            label: t('DataGain'),
            revValue: 'datarev'
        }
    ];
    if (allAChPage === false) {
        sortOptions.unshift({value: 'unlocked', label: t('Gained'), revValue: 'unlockedRev'});
    } else {
        sortOptions.unshift({value: '', label: t(''), revValue: ''});
    }
    return (
        <I18nextProvider i18n={i18n}>
            <table>
                <thead>
                    <tr>
                        {sortOptions.map((option) => {
                            return <th
                                onClick={() => {
                                setSortConfig(sortConfig === option.value
                                    ? option.revValue
                                    : option.value)
                            }}>{option.label} {sortConfig === option.value
                                    ? "\u25BC"
                                    : sortConfig === option.revValue
                                        ? "\u25B2"
                                        : ""}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {achSort.map((achievement : DatumClass) => (
                        <tr
                            className={achievement.percent <= 5
                            ? "rare1"
                            : ""}>
                            <td >
                                <img
                                    className={achievement.percent <= 5
                                    ? "rare1 table-ach-img"
                                    : achievement.percent <= 20
                                        ? "rare2 table-ach-img"
                                        : achievement.percent <= 45
                                            ? "rare3 table-ach-img"
                                            : achievement.percent <= 60
                                                ? "rare4 table-ach-img"
                                                : "rare5 table-ach-img"}
                                    src={achievement.achieved
                                    ? achievement.icon
                                    : achievement.icongray}></img>
                            </td>
                            <td>{achievement.displayName}</td>
                            <td>{achievement.description}</td>
                            <td>{achievement.percent.toFixed(2)}
                                %</td>
                            <td>{UnixTimestampToDate(achievement.unlocktime) == "1970.1.1"
                                    ? "-"
                                    : UnixTimestampToDate(achievement.unlocktime)}</td>
                        </tr>
                    ))}</tbody>

            </table>
        </I18nextProvider>
    );
}