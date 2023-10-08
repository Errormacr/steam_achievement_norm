import {useCallback, useEffect, useState} from "react";
import {UnixTimestampToDate} from "./GameCard";
import {I18nextProvider} from 'react-i18next';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import './scss/Table.scss';
export default function Table(data : any) {
    const [game,
        setGame] = useState([]);
    const [sortConfig,
        setSortConfig] = useState("data");
    const [allAChPage,
        setAllAchPage] = useState(Boolean);
    const {t} = useTranslation();
    useEffect(useCallback(() => {
        try {

            setAllAchPage(data['data'][1]);
            setGame(data['data'][0]);
            console.log(allAChPage);
        } catch (error) {
            window.alert(error.message);
        }
    }, [allAChPage, allAChPage]), []);

    const achSort = game.sort((a : any, b : any) => {
        switch (sortConfig) {
            case "namerev":
                return a
                    .displayName
                    .localeCompare(b.displayName);
            case "name":
                return b
                    .displayName
                    .localeCompare(a.displayName);
            case "descrev":
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
            case "unlockedrev":
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
            revvalue: 'namerev'
        }, {
            value: 'desc',
            label: t('Description'),
            revvalue: 'descrev'
        }, {
            value: 'proc',
            label: t('PercentPlayer'),
            revvalue: 'procrev'
        }, {
            value: 'data',
            label: t('DataGain'),
            revvalue: 'datarev'
        }
    ];
    if (allAChPage === false) {
        sortOptions.unshift({value: 'unlocked', label: t('Gained'), revvalue: 'unlockedrev'});
    } else {
        sortOptions.unshift({value: '', label: t(''), revvalue: ''});
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
                                    ? option.revvalue
                                    : option.value)
                            }}>{option.label} {sortConfig === option.value
                                    ? "\u25BC"
                                    : sortConfig === option.revvalue
                                        ? "\u25B2"
                                        : ""}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {achSort.map((achivment : any) => (
                        <tr
                            className={achivment.percent <= 5
                            ? "rare1"
                            : ""}>
                            <td >
                                <img
                                    className={achivment.percent <= 5
                                    ? "rare1 table-ach-img"
                                    : achivment.percent <= 20
                                        ? "rare2 table-ach-img"
                                        : achivment.percent <= 45
                                            ? "rare3 table-ach-img"
                                            : achivment.percent <= 60
                                                ? "rare4 table-ach-img"
                                                : "rare5 table-ach-img"}
                                    src={achivment.achieved
                                    ? achivment.icon
                                    : achivment.icongray}></img>
                            </td>
                            <td>{achivment.displayName}</td>
                            <td>{achivment.description}</td>
                            <td>{(parseFloat(achivment.percent)).toFixed(2)}
                                %</td>
                            <td>{UnixTimestampToDate(achivment.unlocktime) == "1970.1.1"
                                    ? "-"
                                    : UnixTimestampToDate(achivment.unlocktime)}</td>
                        </tr>
                    ))}</tbody>

            </table>
        </I18nextProvider>
    );
};