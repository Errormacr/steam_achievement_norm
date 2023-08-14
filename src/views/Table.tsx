import {useCallback, useEffect, useState} from "react";
import {UnixTimestampToDate} from "./Games";
import React from 'react';
export default function Table(data : any) {
    const [game,
        setGame] = useState([]);
    const [sortConfig,
        setSortConfig] = useState("");
    const [allAChPage,
        setAllAchPage] = useState(Boolean);
    useEffect(useCallback(() => {
        try {

            setAllAchPage(data['data'][1]);
            setGame(data['data'][0]);
            console.log(allAChPage);
        } catch (error) {
            window.alert(error.message);
        }
    }, [game, allAChPage]), []);
    function sortByName() {
        const dataSort = [...game].sort((a, b) => {
            return sortConfig === "name"
                ? a
                    .displayName
                    .localeCompare(b.displayName)
                : b
                    .displayName
                    .localeCompare(a.displayName);
        });
        setSortConfig(sortConfig === "name"
            ? "namerev"
            : "name");
        setGame(dataSort);
    }

    function sortByDesc() {
        const dataSort = [...game].sort((a, b) => {
            return sortConfig === "desc"
                ? a
                    .description
                    .localeCompare(b.description)
                : b
                    .description
                    .localeCompare(a.description);
        });
        setSortConfig(sortConfig === "desc"
            ? "descrev"
            : "desc");
        setGame(dataSort);
    }

    function sortByProcent() {
        const dataSort = [...game].sort((a, b) => {
            return sortConfig === "proc"
                ? a.percent - b.percent
                : b.percent - a.percent;
        });
        setSortConfig(sortConfig === "proc"
            ? "procrev"
            : "proc");
        setGame(dataSort);
    }

    function sortByUnclocked() {
        const dataSort = [...game].sort((a, b) => {
            if (a.achieved && b.achieved) {
                return 0;
            }
            return sortConfig === "unlocked"
                ? a.achieved - b.achieved
                : b.achieved - a.achieved;
        })
        setSortConfig(sortConfig === "unlocked"
            ? "unlockedrev"
            : "unlocked");
        console.log(sortConfig);
        setGame(dataSort);
    }
    function sortByData() {
        const dataSort = [...game].sort((a, b) => {
            if (a.unlocktime === 0 && b.unlocktime === 0) {
                return 0;
            }
            if (a.unlocktime === 0) {
                return 1;
            }
            if (b.unlocktime === 0) {
                return -1;
            }
            return sortConfig === "data"
                ? a.unlocktime - b.unlocktime
                : b.unlocktime - a.unlocktime;
        });
        setSortConfig(sortConfig === "data"
            ? "datarev"
            : "data");
        setGame(dataSort);
    }

    return (
        <table>
            <thead>
                <tr>
                    {allAChPage === false
                        ? (
                            <th onClick={sortByUnclocked}>Открыто {sortConfig === "unlocked"
                                    ? "\u25BC"
                                    : sortConfig === "unlockedrev"
                                        ? "\u25B2"
                                        : ""}</th>
                        )
                        : (
                            <th></th>
                        )}
                    <th onClick={sortByName}>Название {sortConfig === "name"
                            ? "\u25B2"
                            : sortConfig === "namerev"
                                ? "\u25BC"
                                : ""}</th>
                    <th onClick={sortByDesc}>Описание {sortConfig === "desc"
                            ? "\u25B2"
                            : sortConfig === "descrev"
                                ? "\u25BC"
                                : ""}</th>
                    <th onClick={sortByProcent}>Процент у игроков {sortConfig === "proc"
                            ? "\u25B2"
                            : sortConfig === "procrev"
                                ? "\u25BC"
                                : ""}</th>
                    <th onClick={sortByData}>Дата получения {sortConfig === "data"
                            ? "\u25B2"
                            : sortConfig === "datarev"
                                ? "\u25BC"
                                : ""}</th>
                </tr>
            </thead>
            <tbody>
                {game.map((achivment : any) => (
                    <tr
                        className={achivment.percent <= 5
                        ? "rare1"
                        : ""}>
                        <td
                            style={{
                            width: "3em"
                        }}>
                            <img
                                style={{
                                width: "2.5em"
                            }}
                                className={achivment.percent <= 5
                                ? "rare1"
                                : achivment.percent <= 20
                                    ? "rare2"
                                    : achivment.percent <= 45
                                        ? "rare3"
                                        : achivment.percent <= 60
                                            ? "rare4"
                                            : "rare5"}
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
    );
};