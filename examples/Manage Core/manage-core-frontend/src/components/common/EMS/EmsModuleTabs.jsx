import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap, faBuilding, faUsers, faClipboard, faUserTie,
  faLayerGroup, faCheckCircle, faCalendarAlt, faTasks, faFileAlt,
  faBook, faBus, faBed, faHeartbeat, faUserGraduate, faFlask,
  faShieldAlt, faWallet, faGauge, faChartBar, faRobot, faFile,
  faCog,   faLocationDot, faSitemap, faCalendar, faDoorOpen, faUser,
  faComments, faChalkboardTeacher, faBookOpen, faCertificate,
  faGaugeHigh, faHome
} from "@fortawesome/free-solid-svg-icons";

export const getEmsModuleTabs = (t) => [
  { id: 'ems_overview', label: 'EMS Dashboard', icon: <FontAwesomeIcon icon={faHome} /> },

  // Institution Management Group
  {
    id: 'ems_institution_group',
    label: t('institution_management') || 'Institution Management',
    icon: <FontAwesomeIcon icon={faBuilding} />,
    subTabs: [
      { id: 'ems_institution_dashboard', label: t('institution_dashboard') || 'Institution Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_institutions', label: t('institutions') || 'Institutions', icon: <FontAwesomeIcon icon={faBuilding} /> },
      { id: 'ems_campuses', label: t('campuses') || 'Campuses', icon: <FontAwesomeIcon icon={faLocationDot} /> },
      { id: 'ems_departments', label: t('departments') || 'Departments', icon: <FontAwesomeIcon icon={faSitemap} /> },
      { id: 'ems_programs', label: t('programs') || 'Programs', icon: <FontAwesomeIcon icon={faBook} /> },
      { id: 'ems_academic_years', label: t('academic_years') || 'Academic Years', icon: <FontAwesomeIcon icon={faCalendar} /> },
      { id: 'ems_semesters', label: t('semesters') || 'Semesters', icon: <FontAwesomeIcon icon={faCalendar} /> },
      { id: 'ems_buildings', label: t('buildings') || 'Buildings', icon: <FontAwesomeIcon icon={faBuilding} /> },
      { id: 'ems_rooms', label: t('rooms') || 'Rooms', icon: <FontAwesomeIcon icon={faDoorOpen} /> },
    ]
  },

  // Student Information Group
  {
    id: 'ems_student_group',
    label: t('student_information') || 'Student Information',
    icon: <FontAwesomeIcon icon={faUsers} />,
    subTabs: [
      { id: 'ems_student_dashboard', label: t('student_dashboard') || 'Student Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_students', label: t('all_students') || 'All Students', icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'ems_student_profile', label: t('student_profile') || 'Student Profile', icon: <FontAwesomeIcon icon={faUser} /> },
      { id: 'ems_parents', label: t('parents_guardians') || 'Parents & Guardians', icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'ems_communication', label: t('communication') || 'Communication', icon: <FontAwesomeIcon icon={faComments} /> },
    ]
  },

  // Admissions Group
  {
    id: 'ems_admissions_group',
    label: t('admissions') || 'Admissions',
    icon: <FontAwesomeIcon icon={faClipboard} />,
    subTabs: [
      { id: 'ems_admission_dashboard', label: t('admission_dashboard') || 'Admission Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_admissions', label: t('admissions') || 'Admissions', icon: <FontAwesomeIcon icon={faClipboard} /> },
    ]
  },

  // Staff & Faculty Group
  {
    id: 'ems_staff_group',
    label: t('staff_faculty') || 'Staff & Faculty',
    icon: <FontAwesomeIcon icon={faUserTie} />,
    subTabs: [
      { id: 'ems_staff_dashboard', label: t('staff_dashboard') || 'Staff Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_teachers', label: t('teachers') || 'Teachers', icon: <FontAwesomeIcon icon={faChalkboardTeacher} /> },
      { id: 'ems_employees', label: t('employees') || 'Employees', icon: <FontAwesomeIcon icon={faUsers} /> },
    ]
  },

  // Academic Structure Group
  {
    id: 'ems_academic_group',
    label: t('academic_structure') || 'Academic Structure',
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    subTabs: [
      { id: 'ems_academic_dashboard', label: t('academic_dashboard') || 'Academic Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_classes', label: t('classes_sections') || 'Classes & Sections', icon: <FontAwesomeIcon icon={faLayerGroup} /> },
      { id: 'ems_subjects', label: t('subjects') || 'Subjects', icon: <FontAwesomeIcon icon={faBook} /> },
      { id: 'ems_courses', label: t('courses') || 'Courses', icon: <FontAwesomeIcon icon={faBookOpen} /> },
    ]
  },

  // Attendance Group
  {
    id: 'ems_attendance_group',
    label: t('attendance') || 'Attendance',
    icon: <FontAwesomeIcon icon={faCheckCircle} />,
    subTabs: [
      { id: 'ems_attendance_dashboard', label: t('attendance_dashboard') || 'Attendance Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_attendance', label: t('attendance_records') || 'Attendance Records', icon: <FontAwesomeIcon icon={faCheckCircle} /> },
    ]
  },

  // Timetable Group
  {
    id: 'ems_timetable_group',
    label: t('timetable_scheduling') || 'Timetable & Scheduling',
    icon: <FontAwesomeIcon icon={faCalendarAlt} />,
    subTabs: [
      { id: 'ems_timetable_dashboard', label: t('timetable_dashboard') || 'Timetable Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_timetables', label: t('timetables') || 'Timetables', icon: <FontAwesomeIcon icon={faCalendarAlt} /> },
      { id: 'ems_events', label: t('events') || 'Events', icon: <FontAwesomeIcon icon={faCalendar} /> },
    ]
  },

  // Assignments Group
  {
    id: 'ems_assignment_group',
    label: t('assignments_coursework') || 'Assignments & Coursework',
    icon: <FontAwesomeIcon icon={faTasks} />,
    subTabs: [
      { id: 'ems_assignment_dashboard', label: t('assignment_dashboard') || 'Assignment Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_assignments', label: t('assignments') || 'Assignments', icon: <FontAwesomeIcon icon={faTasks} /> },
    ]
  },

  // Examinations Group
  {
    id: 'ems_exam_group',
    label: t('examinations') || 'Examinations',
    icon: <FontAwesomeIcon icon={faFileAlt} />,
    subTabs: [
      { id: 'ems_exam_dashboard', label: t('exam_dashboard') || 'Exam Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_examinations', label: t('examinations') || 'Examinations', icon: <FontAwesomeIcon icon={faFileAlt} /> },
      { id: 'ems_grades', label: t('grades_results') || 'Grades & Results', icon: <FontAwesomeIcon icon={faChartBar} /> },
      { id: 'ems_certificates', label: t('certificates') || 'Certificates', icon: <FontAwesomeIcon icon={faCertificate} /> },
    ]
  },

  // LMS Group
  {
    id: 'ems_lms_group',
    label: t('learning_management') || 'Learning Management (LMS)',
    icon: <FontAwesomeIcon icon={faGraduationCap} />,
    subTabs: [
      { id: 'ems_lms_dashboard', label: t('lms_dashboard') || 'LMS Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_courses_lms', label: t('courses_lessons') || 'Courses & Lessons', icon: <FontAwesomeIcon icon={faGraduationCap} /> },
    ]
  },

  // Library Group
  {
    id: 'ems_library_group',
    label: t('library') || 'Library',
    icon: <FontAwesomeIcon icon={faBook} />,
    subTabs: [
      { id: 'ems_library_dashboard', label: t('library_dashboard') || 'Library Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_library', label: t('library_catalog') || 'Library Catalog', icon: <FontAwesomeIcon icon={faBook} /> },
    ]
  },

  // Transport Group
  {
    id: 'ems_transport_group',
    label: t('transport') || 'Transport',
    icon: <FontAwesomeIcon icon={faBus} />,
    subTabs: [
      { id: 'ems_transport_dashboard', label: t('transport_dashboard') || 'Transport Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_transport', label: t('transport_management') || 'Transport Management', icon: <FontAwesomeIcon icon={faBus} /> },
    ]
  },

  // Hostel Group
  {
    id: 'ems_hostel_group',
    label: t('hostel_accommodation') || 'Hostel & Accommodation',
    icon: <FontAwesomeIcon icon={faBed} />,
    subTabs: [
      { id: 'ems_hostel_dashboard', label: t('hostel_dashboard') || 'Hostel Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_hostel', label: t('hostel_management') || 'Hostel Management', icon: <FontAwesomeIcon icon={faBed} /> },
    ]
  },

  // Medical Group
  {
    id: 'ems_medical_group',
    label: t('medical_health') || 'Medical & Health',
    icon: <FontAwesomeIcon icon={faHeartbeat} />,
    subTabs: [
      { id: 'ems_medical_dashboard', label: t('medical_dashboard') || 'Medical Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_medical', label: t('medical_center') || 'Medical Center', icon: <FontAwesomeIcon icon={faHeartbeat} /> },
    ]
  },

  // Alumni Group
  {
    id: 'ems_alumni_group',
    label: t('alumni_career') || 'Alumni & Career Services',
    icon: <FontAwesomeIcon icon={faUserGraduate} />,
    subTabs: [
      { id: 'ems_alumni_dashboard', label: t('alumni_dashboard') || 'Alumni Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_alumni', label: t('alumni_directory') || 'Alumni Directory', icon: <FontAwesomeIcon icon={faUserGraduate} /> },
    ]
  },

  // Research Group
  {
    id: 'ems_research_group',
    label: t('research_innovation') || 'Research & Innovation',
    icon: <FontAwesomeIcon icon={faFlask} />,
    subTabs: [
      { id: 'ems_research_dashboard', label: t('research_dashboard') || 'Research Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_research', label: t('research_management') || 'Research Management', icon: <FontAwesomeIcon icon={faFlask} /> },
    ]
  },

  // Campus Group
  {
    id: 'ems_campus_group',
    label: t('campus_facilities') || 'Campus & Facilities',
    icon: <FontAwesomeIcon icon={faBuilding} />,
    subTabs: [
      { id: 'ems_campus_dashboard', label: t('campus_dashboard') || 'Campus Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_campus_facilities', label: t('facilities') || 'Facilities', icon: <FontAwesomeIcon icon={faBuilding} /> },
    ]
  },

  // Security Group
  {
    id: 'ems_security_group',
    label: t('security_safety') || 'Security & Safety',
    icon: <FontAwesomeIcon icon={faShieldAlt} />,
    subTabs: [
      { id: 'ems_security_dashboard', label: t('security_dashboard') || 'Security Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_security', label: t('security_center') || 'Security Center', icon: <FontAwesomeIcon icon={faShieldAlt} /> },
    ]
  },

  // Fees Group
  {
    id: 'ems_fees_group',
    label: t('fees_finance') || 'Fees & Finance',
    icon: <FontAwesomeIcon icon={faWallet} />,
    subTabs: [
      { id: 'ems_fees_dashboard', label: t('fees_dashboard') || 'Fees Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'ems_fees', label: t('fee_management') || 'Fee Management', icon: <FontAwesomeIcon icon={faWallet} /> },
    ]
  },

  // Standalone tabs
  { id: 'ems_analytics', label: t('analytics') || 'Analytics', icon: <FontAwesomeIcon icon={faChartBar} /> },
  { id: 'ems_ai_assistant', label: t('ai_education_assistant') || 'AI Education Assistant', icon: <FontAwesomeIcon icon={faRobot} /> },
  { id: 'ems_reports', label: t('reports') || 'Reports', icon: <FontAwesomeIcon icon={faFile} /> },
  { id: 'ems_settings', label: t('settings') || 'Settings', icon: <FontAwesomeIcon icon={faCog} /> },
];
