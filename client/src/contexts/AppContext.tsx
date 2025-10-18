import { createContext, useContext, useEffect, useState } from 'react';
import { Product, User } from '../types';
import api from '../utils/api';

export const AuthContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const getProductsData = async () => {
        const { data } = await api.get('/products');
        setProducts(data);
    };

    const getUsersData = async () => {
        const { data } = await api.get('/users');
        setUsers(data);
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await Promise.all([
                    getProductsData(),
                    getUsersData()
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchAllData();
    }, []);


    return (
        <AuthContext.Provider value={{
            products, setProducts,
            users, setUsers,
            getProductsData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAppContext = () => useContext(AuthContext);