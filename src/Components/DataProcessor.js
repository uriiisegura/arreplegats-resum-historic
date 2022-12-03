import { useEffect } from "react";
import * as Papa from 'papaparse';

function DataProcessor(props) {
    const { setCastells, setPuntuacions } = props;
    const CASTELLS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQeAif6pgFuLUAXHif4IsrSXzG8itYhirTHGdmNzA5RmrEPcJe7lcfwfNVLBEcgnn3mZbThqaZdouiP/pub?gid=1678902832&single=true&output=csv";
    const SCORE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQeAif6pgFuLUAXHif4IsrSXzG8itYhirTHGdmNzA5RmrEPcJe7lcfwfNVLBEcgnn3mZbThqaZdouiP/pub?gid=1401475200&single=true&output=csv";

    const get_data = (link, callback) => Papa.parse(link, {
        download: true,
        header: true,
        complete: (results) => callback(results) 
    });

    const pad = (n, width, z) => {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };

    const aggregate = (rows) => {
        const parseDate = (row) => pad(row["dia"],2)+"/"+pad(row["mes"],2)+"/"+row["any"];
        const get_diada_hash = (row) => parseDate(row) + " - " + row["motiu"];
        const diades = [...new Set(rows.map(row => get_diada_hash(row)))];

        let diades_dict = {};
        diades.forEach(diada_hash => {
            diades_dict[diada_hash] = {};
            const by_diada = rows.filter(row => get_diada_hash(row) === diada_hash);
            if (by_diada.length === 0) return;
            diades_dict[diada_hash]["info"] = (({ dia, mes, any, situació, ciutat, motiu }) => ({ dia, mes, any, situació, ciutat, motiu }))(by_diada[0]);
            
            diades_dict[diada_hash]["castells"] = by_diada.map(castell => (({ tipus, alçada, agulla, pinya, altres, ordre, resolució }) => ({ tipus, alçada, agulla, pinya, altres, ordre, resolució }))(castell));
            diades_dict[diada_hash]["castells"].forEach((castell, i) => {
                const resultat = castell["resolució"];
                const ordre = castell["ordre"];
                if (castell["pinya"].includes("n") || resultat.includes("pd") || resultat.includes("i")) {
                    delete diades_dict[diada_hash]["castells"][i];
                    return;
                }
                const agulla = castell["agulla"] === "1" ? "a" : "";
                const fix4d8 = castell["tipus"].toUpperCase() + "d" + castell["alçada"] === "4d8" && castell["pinya"] === "" ? "sf" : "";
                const build = castell["tipus"].toUpperCase() + "d" + castell["alçada"] + castell["pinya"] + fix4d8 + agulla;
                //if (build === "4d8sf") console.log(diada_hash)
                diades_dict[diada_hash]["castells"][i] = {};
                diades_dict[diada_hash]["castells"][i][ordre] = build + resultat.toUpperCase();
            });
            diades_dict[diada_hash]["info"]["data"] = parseDate(diades_dict[diada_hash]["info"]);
            delete diades_dict[diada_hash]["info"]["dia"];
            delete diades_dict[diada_hash]["info"]["mes"];
            delete diades_dict[diada_hash]["info"]["any"];
        });

        return diades_dict;
    };

    const process_puntuacions = (data) => {
        let puntuacions_dict = {};
        data.forEach(castell => {
            puntuacions_dict[castell.castell] = parseInt(castell["Descarregat"]);
        });

        return puntuacions_dict;
    };

    useEffect(() => {
        get_data(CASTELLS_URL, (results) => {
            setCastells(aggregate(results.data));
        });

        get_data(SCORE_URL, (results) => {
            setPuntuacions(process_puntuacions(results.data));
        });
    }, []);
}

export default DataProcessor;
