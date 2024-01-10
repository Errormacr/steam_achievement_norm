import React, {useState, useEffect} from 'react';
import {I18nextProvider, useTranslation} from 'react-i18next';
import i18n from 'i18next';
import GameButton from './GameButton';

export default function ChangeAccount() {
    const [isOpen,
        setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const {t} = useTranslation();

    useEffect(() => {
        const handleOutsideClick = (event : MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.modal-content')) {
                closeModal();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <I18nextProvider i18n={i18n}>
            <GameButton id='' additionalClass='' onClick={openModal} text={t('changeAcc')}/> {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className='settingsHeader'>{t('chAccHeading')}</h2>
                        <div className='accContainer'>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div> <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div> <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div> <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div> <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div> <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                            <div className="userContainer">
                                <img
                                    style={{
                                    width: "4.5rem",
                                    height: "4.5rem"
                                }}
                                    src={localStorage.getItem('ava')}/>
                                <p
                                    style={{
                                    marginBlock: "0"
                                }}>Name</p>
                            </div>
                        </div>
                        <GameButton id='' additionalClass='' onClick={openModal} text={t('addAcc')}/>
                    </div>
                </div>
            )}
        </I18nextProvider>
    );
}
