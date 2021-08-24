import React, { useEffect, useState } from 'react';

import {useHistory } from 'react-router-dom';
import { Tweet } from 'react-twitter-widgets';
import axios from 'axios';

import {copyToClipboard } from '../utils/Clipboard';
import Header from '../components/Header';
import { API } from '../utils/Constants';

import spinner from '../spinner.svg';
import settings from '../admin/settings.json';


const Result = () => {

    const [tweets, setTweets] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(settings.predictor.labels[0].id);
    const [isEmptySearch, setIsEmptySearch] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const testIDs = ["7405a0a3-5a73-4e7c-a6e9-a7eb0873f28b"]
    const history = useHistory();


    const reduceData = (data) =>{
        let newData = {}
        for(let label of Object.keys(data)){
            newData[label] = data[label].slice(1,10); 
        }
        return newData;
    } 

    useEffect(() => {
        axios.get(API.results, {params: {id: testIDs[Math.floor(Math.random() * testIDs.length)]}}).then(response => {
            setTimeout(() => {
                setSearchTerm(response.data.search_term);
                if(response.data.processing === undefined) {
                    setTweets(reduceData(JSON.parse(response.data.data)));
                } else if (!response.data.processing) { // Empty search
                    setIsEmptySearch(true);
                }
                setLoading(false);
            }, 500);
        }).catch(() => {
            setTimeout(() => {
                history.push('/404');
                setLoading(false);
            }, 500);
        });
    }, []);

    const copyLink = () => {
        copyToClipboard();
        setLinkCopied(true);
    };

    const activeTabCSSClasses = `inline-block bg-gray-200 px-3 py-2 rounded-md text-gray-500`;
    const inactiveTabCSSClasses = `inline-block hover:bg-gray-100 px-3 py-2 rounded-md text-gray-600`;

    return (
        <div className="m-5">
            <Header />
            { loading ? <img className="mx-auto mt-16 h-10" src={spinner} /> :
            isEmptySearch ?
                <main className="mt-16 mx-auto text-center md:w-3/4 lg:w-1/2">
                    <p className="text-2xl font-semibold">
                        Unfortunately, the search <i>{ searchTerm }</i> has no results!
                    </p>
                    <p className="text-2xl font-semibold">:(</p>
                    <br />
                    <a className="text-2xl font-semibold text-blue-900 hover:underline" href="/">
                        Go back to home
                    </a>
                </main> :
            Object.keys(tweets).length === 0 ?
                <main className="mt-16 mx-auto text-center md:w-3/4 lg:w-1/2">
                    <p>We are collecting and classifying tweets, this may take several minutes.</p>
                    { linkCopied ? <p className="text-green-400 font-semibold">Link copied!</p> :
                        <p>
                            <button type="button" className="text-blue-900 font-bold hover:underline" 
                            onClick={copyLink}>Copy the link</button> and come back later.
                        </p>
                    }
                </main> :
                <main className="mt-16 mx-auto text-center lg:w-3/4">
                    <ul className="space-x-4">
                        { settings.predictor.labels.map(label => {
                            return (
                                <li className={activeTab === label.id ? activeTabCSSClasses : inactiveTabCSSClasses} key={label.id}>
                                    <button className="focus:outline-none font-semibold"
                                    onClick={() => setActiveTab(label.id)}>
                                        {label.label}
                                    </button>
                                </li>
                            );
                        }) }
                    </ul>
                    <div className="mt-16 mx-auto text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        { tweets[activeTab] !== undefined ? 
                            tweets[activeTab].map(id => <Tweet key={id} tweetId={id} />) :
                            <p className="italic text-gray-600 col-span-3">
                                No tweets were classified into this category.
                            </p>
                        }
                    </div>
                </main>
            }
        </div>
    );
};

export default Result;
