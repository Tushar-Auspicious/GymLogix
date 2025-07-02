import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const SETTINGS = () => {
  const [acitveUi, setAcitveUi] = useState(0);

  // Expanded UI states
  const [expandedSoundUI, setExpandedSoundUI] = useState(false);
  const [expandedGeneralUI, setExpandedGeneralUI] = useState(false);
  const [expandedWorkoutUI, setExpandedWorkoutUI] = useState(false);
  const [expandedDataUI, setExpandedDataUI] = useState(false);
  const [expandedHelpUI, setExpandedHelpUI] = useState(false);

  // Sound & Notification settings
  const [volumeLevel, setVolumeLevel] = useState(75);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableReminders, setEnableReminders] = useState(true);

  // General settings
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedUnits, setSelectedUnits] = useState("Metric"); // Metric or Imperial
  const [preventScreenLock, setPreventScreenLock] = useState(true);

 
  const [selectedRMFormula, setSelectedRMFormula] = useState("Epley Formula");
  const [
    updateBodyWeightFromMeasurements,
    setUpdateBodyWeightFromMeasurements,
  ] = useState(true);

  // Data settings
  const [syncToCloud, setSyncToCloud] = useState(true);
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState("1 Year");
  const [shareAnalytics, setShareAnalytics] = useState(false);

  const rendermemberShipData = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          width: wp(100),

          gap: verticalScale(10),
        }}
        style={{ flex: 1, marginBottom: verticalScale(5) }}
      >
        <View
          style={{
            paddingHorizontal: horizontalScale(20),
            paddingVertical: verticalScale(20),
            alignSelf: "center",
            gap: verticalScale(30),
            backgroundColor: COLORS.brown,
            borderRadius: 10,
            width: "95%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: horizontalScale(10),
              alignItems: "center",
            }}
          >
            <CustomIcon
              onPress={() => setAcitveUi(0)}
              Icon={ICONS.BackArrow}
              height={16}
              width={16}
            />
            <CustomText
              fontFamily="italicBold"
              color={COLORS.yellow}
              fontSize={20}
            >
              Membership Benefits
            </CustomText>
          </View>

          <View style={{ gap: verticalScale(20) }}>
            <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
              <CustomIcon Icon={ICONS.Membership1Icon} height={22} width={22} />
              <View style={{ flex: 1 }}>
                <CustomText
                  fontFamily="italicBold"
                  color={COLORS.yellow}
                  fontSize={14}
                >
                  Access to all programs
                </CustomText>
                <CustomText
                  color={COLORS.whiteTail}
                  fontSize={11}
                  fontFamily="medium"
                >
                  Gain unlimited access to all workout and nutrition programs,
                  tailored to your goals.
                </CustomText>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
              <CustomIcon Icon={ICONS.Membership2Icon} height={22} width={22} />
              <View style={{ flex: 1 }}>
                <CustomText
                  fontFamily="italicBold"
                  color={COLORS.yellow}
                  fontSize={14}
                >
                  AI Driven insight
                </CustomText>
                <CustomText
                  color={COLORS.whiteTail}
                  fontSize={11}
                  fontFamily="medium"
                >
                  Track progress smarter with AI-driven insights—review detailed
                  summaries of past workouts to fine-tune your performance and
                  reach your fitness goals faster.
                </CustomText>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
              <CustomIcon Icon={ICONS.Membershi3Icon} height={22} width={22} />
              <View style={{ flex: 1 }}>
                <CustomText
                  fontFamily="italicBold"
                  color={COLORS.yellow}
                  fontSize={14}
                >
                  Expert Guidance
                </CustomText>
                <CustomText
                  color={COLORS.whiteTail}
                  fontSize={11}
                  fontFamily="medium"
                >
                  Get expert guidance on demand—receive personalized feedback
                  from real trainers and ask questions to enhance your workout
                  experience anytime.
                </CustomText>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
              <CustomIcon Icon={ICONS.Membershi4Icon} height={22} width={22} />
              <View style={{ flex: 1 }}>
                <CustomText
                  fontFamily="italicBold"
                  color={COLORS.yellow}
                  fontSize={14}
                >
                  Advanced Meteric
                </CustomText>
                <CustomText
                  color={COLORS.whiteTail}
                  fontSize={11}
                  fontFamily="medium"
                >
                  Elevate your progress with in-depth metrics and detailed
                  statistics, helping you analyze and optimize every aspect of
                  your training.
                </CustomText>
              </View>
            </View>
          </View>

          <View
            style={{
              gap: verticalScale(10),
              paddingHorizontal: horizontalScale(20),
              marginVertical: verticalScale(20),
            }}
          >
            <CustomText
              fontSize={12}
              fontFamily="bold"
              style={{ textAlign: "center" }}
            >
              Cancel Anytime * Recurring Billing
            </CustomText>
            <CustomText
              fontSize={11}
              fontFamily="medium"
              style={{ textAlign: "center" }}
            >
              Your Google Play or iTunes account will be charged, and the
              membership will renew automatically. You can cancel at least 24
              hours before the end of the billing period to prevent renewal.
            </CustomText>
          </View>

          <View style={{ paddingHorizontal: horizontalScale(40) }}>
            <CustomText
              fontSize={12}
              fontFamily="medium"
              style={{ textAlign: "center" }}
            >
              You acknowledge and accept GymLogix's{" "}
              <CustomText
                fontSize={12}
                fontFamily="medium"
                color={COLORS.yellow}
              >
                privacy policy
              </CustomText>{" "}
              and{" "}
              <CustomText
                fontSize={12}
                fontFamily="medium"
                color={COLORS.yellow}
              >
                Terms & Conditions
              </CustomText>
            </CustomText>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: horizontalScale(20),
            paddingVertical: verticalScale(20),
            alignSelf: "center",
            gap: verticalScale(30),
            backgroundColor: COLORS.brown,
            width: "95%",
            borderRadius: 10,
          }}
        >
          <CustomText
            style={{ textAlign: "center" }}
            fontFamily="bold"
            fontSize={12}
          >
            Join Now to access all beinfits
          </CustomText>
          <View style={{ gap: verticalScale(10) }}>
            <View
              style={{
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#D71745",
                  paddingVertical: verticalScale(10),
                }}
              >
                <CustomText
                  fontSize={12}
                  fontFamily="medium"
                  style={{ textAlign: "center" }}
                >
                  CONTINUE
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#941231",
                  paddingVertical: verticalScale(10),
                }}
              >
                <CustomText
                  fontSize={12}
                  fontFamily="medium"
                  style={{ textAlign: "center" }}
                >
                  29.99$/mo
                </CustomText>
              </TouchableOpacity>
            </View>
            <CustomText
              fontSize={12}
              fontFamily="medium"
              style={{ textAlign: "center" }}
            >
              Billed annually at 202%/year
            </CustomText>
          </View>
          <View style={{ gap: verticalScale(10) }}>
            <View
              style={{
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#999999",
                  paddingVertical: verticalScale(10),
                }}
              >
                <CustomText
                  fontSize={12}
                  fontFamily="medium"
                  style={{ textAlign: "center" }}
                >
                  CONTINUE
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#706567",
                  paddingVertical: verticalScale(10),
                }}
              >
                <CustomText
                  fontSize={12}
                  fontFamily="medium"
                  style={{ textAlign: "center" }}
                >
                  29.99$/mo
                </CustomText>
              </TouchableOpacity>
            </View>
            <CustomText
              fontSize={12}
              fontFamily="medium"
              style={{ textAlign: "center" }}
            >
              Billed Monthly
            </CustomText>
          </View>
        </View>
      </ScrollView>
    );
  };

  // Helper component for settings row with switch
  const SettingsRowWithSwitch = ({
    title,
    subtitle,
    value,
    onValueChange,
    icon,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    icon?: any;
  }) => (
    <View style={styles.settingsRow}>
      {icon && <CustomIcon Icon={icon} height={20} width={20} />}
      <View style={styles.settingsTextContainer}>
        <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
          {title}
        </CustomText>
        {subtitle && (
          <CustomText
            fontFamily="regular"
            fontSize={12}
            color={COLORS.whiteTail}
          >
            {subtitle}
          </CustomText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.lightBrown, true: COLORS.yellow }}
        thumbColor={value ? COLORS.white : COLORS.whiteTail}
      />
    </View>
  );

  // Helper component for settings row with selection
  const SettingsRowWithSelection = ({
    title,
    subtitle,
    value,
    onPress,
    icon,
  }: {
    title: string;
    subtitle?: string;
    value: string;
    onPress: () => void;
    icon?: any;
  }) => (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress}>
      {icon && <CustomIcon Icon={icon} height={20} width={20} />}
      <View style={styles.settingsTextContainer}>
        <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
          {title}
        </CustomText>
        {subtitle && (
          <CustomText
            fontFamily="regular"
            fontSize={12}
            color={COLORS.whiteTail}
          >
            {subtitle}
          </CustomText>
        )}
      </View>
      <View style={styles.settingsValueContainer}>
        <CustomText fontFamily="medium" fontSize={14} color={COLORS.yellow}>
          {value}
        </CustomText>
        <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
      </View>
    </TouchableOpacity>
  );

  const renderSoundUI = () => {
    return (
      <View style={styles.expandedContainer}>
        {/* Volume Level Slider */}
        <View style={styles.settingsRow}>
          <CustomIcon Icon={ICONS.NotificationIcon} height={20} width={20} />
          <View style={styles.settingsTextContainer}>
            <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
              Volume Level
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.whiteTail}
            >
              {volumeLevel}%
            </CustomText>
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.customSlider}>
              <View style={[styles.sliderTrack, { width: "100%" }]} />
              <View style={[styles.sliderFill, { width: `${volumeLevel}%` }]} />
              <TouchableOpacity
                style={[
                  styles.sliderThumb,
                  { left: `${Math.max(0, Math.min(92, volumeLevel))}%` },
                ]}
                onPress={() => {
                  // Cycle through volume levels
                  const levels = [0, 25, 50, 75, 100];
                  const currentIndex = levels.findIndex(
                    (level) => level >= volumeLevel
                  );
                  const nextIndex = (currentIndex + 1) % levels.length;
                  setVolumeLevel(levels[nextIndex]);
                }}
              />
            </View>
            {/* Volume level buttons */}
            <View style={styles.volumeButtons}>
              <TouchableOpacity
                onPress={() => setVolumeLevel(Math.max(0, volumeLevel - 10))}
              >
                <CustomText fontSize={12} color={COLORS.yellow}>
                  -
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setVolumeLevel(Math.min(100, volumeLevel + 10))}
              >
                <CustomText fontSize={12} color={COLORS.yellow}>
                  +
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <SettingsRowWithSwitch
          title="Enable Notifications"
          subtitle="Receive workout reminders and updates"
          value={enableNotifications}
          onValueChange={setEnableNotifications}
          icon={ICONS.NotificationIcon}
        />

        <SettingsRowWithSwitch
          title="Enable Reminders"
          subtitle="Get reminded about scheduled workouts"
          value={enableReminders}
          onValueChange={setEnableReminders}
          icon={ICONS.CalendarWithDumbellIcon}
        />
      </View>
    );
  };

  const renderGeneralUI = () => {
    return (
      <View style={styles.expandedContainer}>
        <SettingsRowWithSelection
          title="Language"
          subtitle="Choose your preferred language"
          value={selectedLanguage}
          onPress={() => {
            Alert.alert("Language", "Choose your preferred language", [
              {
                text: "English",
                onPress: () => setSelectedLanguage("English"),
              },
              {
                text: "Español",
                onPress: () => setSelectedLanguage("Español"),
              },
              {
                text: "Français",
                onPress: () => setSelectedLanguage("Français"),
              },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
          icon={ICONS.GeneralIcon}
        />

        <SettingsRowWithSelection
          title="System Units"
          subtitle="Weight and distance measurement units"
          value={selectedUnits}
          onPress={() => {
            Alert.alert("Unit System", "Choose your preferred unit system", [
              {
                text: "Metric (kg/km)",
                onPress: () => setSelectedUnits("Metric"),
              },
              {
                text: "Imperial (lb/mi)",
                onPress: () => setSelectedUnits("Imperial"),
              },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
          icon={ICONS.GeneralIcon}
        />
        <SettingsRowWithSwitch
          title="Prevent Screen Lock"
          subtitle="Keep screen on during workouts"
          value={preventScreenLock}
          onValueChange={setPreventScreenLock}
          icon={ICONS.GeneralIcon}
        />
      </View>
    );
  };

  const renderWorkoutUI = () => {
    return (
      <View style={styles.expandedContainer}>
        <SettingsRowWithSelection
          title="RM Formula"
          subtitle="Choose your preferred 1RM calculation formula"
          value={selectedRMFormula}
          onPress={() => {
            Alert.alert(
              "RM Formula",
              "Choose your preferred 1RM calculation formula",
              [
                {
                  text: "Epley Formula",
                  onPress: () => setSelectedRMFormula("Epley Formula"),
                },
                {
                  text: "Brzycki Formula",
                  onPress: () => setSelectedRMFormula("Brzycki Formula"),
                },
                {
                  text: "Lombardi Formula",
                  onPress: () => setSelectedRMFormula("Lombardi Formula"),
                },
                {
                  text: "O'Connor Formula",
                  onPress: () => setSelectedRMFormula("O'Connor Formula"),
                },
                { text: "Cancel", style: "cancel" },
              ]
            );
          }}
          icon={ICONS.WorkoutIcon}
        />

        <SettingsRowWithSwitch
          title="Update body weight from measurements"
          subtitle="Automatically update body weight from measurement data"
          value={updateBodyWeightFromMeasurements}
          onValueChange={setUpdateBodyWeightFromMeasurements}
          icon={ICONS.WorkoutIcon}
        />
      </View>
    );
  };

  const renderDataUI = () => {
    return (
      <View style={styles.expandedContainer}>
        <CustomText
          fontFamily="bold"
          fontSize={18}
          color={COLORS.yellow}
          style={styles.sectionTitle}
        >
          Data Management
        </CustomText>

        <SettingsRowWithSwitch
          title="Sync to Cloud"
          subtitle="Automatically sync data to cloud storage"
          value={syncToCloud}
          onValueChange={setSyncToCloud}
          icon={ICONS.DataIcon}
        />

        <SettingsRowWithSelection
          title="Data Retention Period"
          subtitle="How long to keep workout history"
          value={dataRetentionPeriod}
          onPress={() => {
            Alert.alert("Data Retention", "Choose how long to keep your data", [
              {
                text: "6 Months",
                onPress: () => setDataRetentionPeriod("6 Months"),
              },
              {
                text: "1 Year",
                onPress: () => setDataRetentionPeriod("1 Year"),
              },
              {
                text: "2 Years",
                onPress: () => setDataRetentionPeriod("2 Years"),
              },
              {
                text: "Forever",
                onPress: () => setDataRetentionPeriod("Forever"),
              },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
          icon={ICONS.DataIcon}
        />

        <SettingsRowWithSwitch
          title="Share Analytics"
          subtitle="Help improve the app by sharing usage data"
          value={shareAnalytics}
          onValueChange={setShareAnalytics}
          icon={ICONS.DataIcon}
        />

        {/* Export Options */}
        <View style={styles.settingsRow}>
          <CustomIcon Icon={ICONS.DataIcon} height={20} width={20} />
          <View style={styles.settingsTextContainer}>
            <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
              Export Data
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.whiteTail}
            >
              Export your data to external files
            </CustomText>
          </View>
        </View>

        {/* Export Buttons */}
        <View
          style={{ gap: verticalScale(10), paddingLeft: horizontalScale(35) }}
        >
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() =>
              Alert.alert("Export", "Exporting all workout data...")
            }
          >
            <CustomText fontFamily="medium" fontSize={14} color={COLORS.white}>
              Export Workouts
            </CustomText>
            <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => Alert.alert("Export", "Exporting training plans...")}
          >
            <CustomText fontFamily="medium" fontSize={14} color={COLORS.white}>
              Export Plans
            </CustomText>
            <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => Alert.alert("Export", "Exporting meal data...")}
          >
            <CustomText fontFamily="medium" fontSize={14} color={COLORS.white}>
              Export Meals
            </CustomText>
            <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => Alert.alert("Export", "Exporting notes...")}
          >
            <CustomText fontFamily="medium" fontSize={14} color={COLORS.white}>
              Export Notes
            </CustomText>
            <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => Alert.alert("Export", "Exporting measurements...")}
          >
            <CustomText fontFamily="medium" fontSize={14} color={COLORS.white}>
              Export Measurements
            </CustomText>
            <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: COLORS.yellow }]}
            onPress={() =>
              Alert.alert("Export", "Exporting complete data file...")
            }
          >
            <CustomText
              fontFamily="bold"
              fontSize={14}
              color={COLORS.darkBrown}
            >
              Export All Data
            </CustomText>
            <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHelpUI = () => {
    return (
      <View style={styles.expandedContainer}>
        <CustomText
          fontFamily="bold"
          fontSize={18}
          color={COLORS.yellow}
          style={styles.sectionTitle}
        >
          Help & Support
        </CustomText>

        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() =>
            Alert.alert(
              "FAQ",
              "Frequently Asked Questions will be displayed here"
            )
          }
        >
          <CustomIcon Icon={ICONS.HelpIcon} height={20} width={20} />
          <View style={styles.settingsTextContainer}>
            <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
              FAQ
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.whiteTail}
            >
              Frequently asked questions
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => Alert.alert("Contact", "Contact support team")}
        >
          <CustomIcon Icon={ICONS.HelpIcon} height={20} width={20} />
          <View style={styles.settingsTextContainer}>
            <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
              Contact Support
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.whiteTail}
            >
              Get help from our support team
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => Alert.alert("Feedback", "Send us your feedback")}
        >
          <CustomIcon Icon={ICONS.HelpIcon} height={20} width={20} />
          <View style={styles.settingsTextContainer}>
            <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
              Send Feedback
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.whiteTail}
            >
              Help us improve the app
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => Alert.alert("Tutorial", "App tutorial will start")}
        >
          <CustomIcon Icon={ICONS.HelpIcon} height={20} width={20} />
          <View style={styles.settingsTextContainer}>
            <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
              App Tutorial
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.whiteTail}
            >
              Learn how to use the app
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => Alert.alert("Terms", "Terms and conditions")}
        >
          <CustomIcon Icon={ICONS.HelpIcon} height={20} width={20} />
          <View style={styles.settingsTextContainer}>
            <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
              Terms & Conditions
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.whiteTail}
            >
              Read our terms and conditions
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => Alert.alert("Privacy", "Privacy policy")}
        >
          <CustomIcon Icon={ICONS.HelpIcon} height={20} width={20} />
          <View style={styles.settingsTextContainer}>
            <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
              Privacy Policy
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.whiteTail}
            >
              Read our privacy policy
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        <View
          style={{
            width: "100%",
            paddingVertical: verticalScale(20),
            gap: verticalScale(10),
          }}
        >
          <View
            style={{
              width: "100%",
              paddingHorizontal: horizontalScale(20),
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <Image
              source={IMAGES.profileDummy}
              style={{
                height: verticalScale(66),
                width: verticalScale(66),
                resizeMode: "contain",
              }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  gap: horizontalScale(10),
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <CustomText fontFamily="bold">John Smith</CustomText>
                  <CustomText fontFamily="medium" fontSize={14}>
                    Jjohn.smith@gmail.com
                  </CustomText>
                </View>

                <CustomIcon Icon={ICONS.dummyQr} />
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: horizontalScale(10),
                  justifyContent: "space-between",
                  marginTop: verticalScale(10),
                }}
              >
                <CustomText fontFamily="medium" fontSize={12}>
                  ID: 14124
                </CustomText>
                <CustomIcon
                  Icon={ICONS.RightArrowIcon}
                  width={12}
                  height={20}
                />
              </View>
            </View>
          </View>
        </View>

        {acitveUi === 0 && (
          <ScrollView
            contentContainerStyle={{
              width: wp(100),
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: COLORS.brown,
              paddingHorizontal: horizontalScale(10),
              alignSelf: "center",
            }}
            style={{ flex: 1, marginBottom: verticalScale(5) }}
          >
            <TouchableOpacity
              onPress={() => setAcitveUi(1)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                paddingVertical: verticalScale(30),
                borderBottomWidth: 1,
                borderBottomColor: COLORS.lightBrown,
              }}
            >
              <CustomIcon Icon={ICONS.MembershipIcon} height={24} width={24} />
              <CustomText fontFamily="medium" fontSize={18} style={{ flex: 1 }}>
                Membership
              </CustomText>
              <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setExpandedSoundUI(!expandedSoundUI)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                paddingVertical: verticalScale(30),
                borderBottomWidth: 1,
                borderBottomColor: COLORS.lightBrown,
              }}
            >
              <CustomIcon
                Icon={ICONS.NotificationIcon}
                height={24}
                width={24}
              />
              <CustomText fontFamily="medium" fontSize={18} style={{ flex: 1 }}>
                Sound & notification
              </CustomText>
              <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
            </TouchableOpacity>
            {expandedSoundUI && renderSoundUI()}
            <TouchableOpacity
              onPress={() => setExpandedGeneralUI(!expandedGeneralUI)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                paddingVertical: verticalScale(30),
                borderBottomWidth: 1,
                borderBottomColor: COLORS.lightBrown,
              }}
            >
              <CustomIcon Icon={ICONS.GeneralIcon} height={24} width={24} />
              <CustomText fontFamily="medium" fontSize={18} style={{ flex: 1 }}>
                General
              </CustomText>
              <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
            </TouchableOpacity>
            {expandedGeneralUI && renderGeneralUI()}
            <TouchableOpacity
              onPress={() => setExpandedWorkoutUI(!expandedWorkoutUI)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                paddingVertical: verticalScale(30),
                borderBottomWidth: 1,
                borderBottomColor: COLORS.lightBrown,
              }}
            >
              <CustomIcon Icon={ICONS.WorkoutIcon} height={24} width={24} />
              <CustomText fontFamily="medium" fontSize={18} style={{ flex: 1 }}>
                Workout
              </CustomText>
              <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
            </TouchableOpacity>
            {expandedWorkoutUI && renderWorkoutUI()}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                paddingVertical: verticalScale(40),
                borderBottomWidth: 1,
                borderBottomColor: COLORS.lightBrown,
              }}
            />
            <TouchableOpacity
              onPress={() => setExpandedDataUI(!expandedDataUI)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                paddingVertical: verticalScale(30),
                borderBottomWidth: 1,
                borderBottomColor: COLORS.lightBrown,
              }}
            >
              <CustomIcon Icon={ICONS.DataIcon} height={24} width={24} />
              <CustomText fontFamily="medium" fontSize={18} style={{ flex: 1 }}>
                Data
              </CustomText>
              <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
            </TouchableOpacity>
            {expandedDataUI && renderDataUI()}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                paddingVertical: verticalScale(30),
                borderBottomWidth: 1,
                borderBottomColor: COLORS.lightBrown,
              }}
            >
              <CustomIcon Icon={ICONS.HelpIcon} height={24} width={24} />
              <CustomText fontFamily="medium" fontSize={18} style={{ flex: 1 }}>
                Help & Suggestions
              </CustomText>
              <CustomIcon Icon={ICONS.RightArrowIcon} height={12} width={20} />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                paddingVertical: verticalScale(30),
              }}
            >
              <CustomText fontFamily="medium" fontSize={18} style={{ flex: 1 }}>
                About
              </CustomText>
              <CustomText fontFamily="medium" fontSize={18} style={{}}>
                1.0.1
              </CustomText>
            </View>
          </ScrollView>
        )}
        {acitveUi === 1 && rendermemberShipData()}
      </SafeAreaView>
    </View>
  );
};

export default SETTINGS;

const styles = StyleSheet.create({
  main: { backgroundColor: "#1C1816", flex: 1 },
  safeArea: {
    flex: 1,
  },
  expandedContainer: {
    gap: verticalScale(15),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: COLORS.brown,
    width: "95%",
    borderRadius: 10,
    marginTop: verticalScale(10),
  },
  sectionTitle: {
    marginBottom: verticalScale(10),
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBrown,
  },
  settingsTextContainer: {
    flex: 1,
    gap: verticalScale(2),
  },
  settingsValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  sliderContainer: {
    width: 120,
    height: 30,
    justifyContent: "center",
  },
  volumeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(5),
    paddingHorizontal: horizontalScale(5),
  },
  customSlider: {
    height: 4,
    position: "relative",
    borderRadius: 2,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: COLORS.lightBrown,
    borderRadius: 2,
    position: "absolute",
  },
  sliderFill: {
    height: 4,
    backgroundColor: COLORS.yellow,
    borderRadius: 2,
    position: "absolute",
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    position: "absolute",
    top: -6,
    marginLeft: -8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(15),
    backgroundColor: COLORS.lightBrown,
    borderRadius: 8,
    marginVertical: verticalScale(5),
  },
  selectedOption: {
    backgroundColor: COLORS.yellow,
  },
  optionText: {
    flex: 1,
  },
  selectedOptionText: {
    color: COLORS.darkBrown,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  languageModal: {
    backgroundColor: COLORS.brown,
    borderRadius: 15,
    padding: verticalScale(20),
    width: wp(85),
    maxHeight: "80%",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 8,
    marginVertical: verticalScale(3),
    backgroundColor: COLORS.lightBrown,
  },
  selectedLanguageOption: {
    backgroundColor: COLORS.yellow,
  },
  closeModalButton: {
    backgroundColor: COLORS.lightBrown,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 8,
    alignItems: "center",
    marginTop: verticalScale(15),
  },
});
