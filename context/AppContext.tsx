import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, StudentData, AppContextType } from '../types';

const defaultStudentData: StudentData = {
    name: '', grade: '', section: '',
    phone: '', email: '', message: 'Happy Republic Day! 🇮🇳', photoUrl: null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    // ========================================
    // STATE WITH LOCALSTORAGE INITIALIZATION
    // ========================================

    const [selectedSchool, setSelectedSchool] = useState<School | null>(() => {
        try {
            const saved = localStorage.getItem('communitree_selectedSchool');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const [studentData, setStudentData] = useState<StudentData>(() => {
        try {
            const saved = localStorage.getItem('communitree_studentData');
            return saved ? JSON.parse(saved) : defaultStudentData;
        } catch (e) {
            return defaultStudentData;
        }
    });

    const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(() => {
        return localStorage.getItem('communitree_submissionId');
    });

    // ========================================
    // AUTO-SYNC TO LOCALSTORAGE
    // ========================================

    useEffect(() => {
        if (selectedSchool) {
            localStorage.setItem('communitree_selectedSchool', JSON.stringify(selectedSchool));
        } else {
            localStorage.removeItem('communitree_selectedSchool');
        }
    }, [selectedSchool]);

    useEffect(() => {
        localStorage.setItem('communitree_studentData', JSON.stringify(studentData));
    }, [studentData]);

    useEffect(() => {
        if (currentSubmissionId) {
            localStorage.setItem('communitree_submissionId', currentSubmissionId);
        } else {
            localStorage.removeItem('communitree_submissionId');
        }
    }, [currentSubmissionId]);

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    const updateStudentData = (data: Partial<StudentData>) => {
        setStudentData((prev) => ({ ...prev, ...data }));
    };

    return (
        <AppContext.Provider value={{
            selectedSchool,
            setSelectedSchool,
            studentData,
            updateStudentData,
            currentSubmissionId,
            setCurrentSubmissionId
        }}>
            {children}
        </AppContext.Provider>
    );
};

// ========================================
// CUSTOM HOOK FOR EASY ACCESS
// ========================================

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
