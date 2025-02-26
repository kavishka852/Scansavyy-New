import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert} from 'react-native';
import {MaterialIcons, Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {useAuthorization} from "@/hooks/useAuthorization";
import HttpService from "@/utils/httpService";
import {formattedDate} from "@/utils/common";
import Loading from "@/components/Loading";

const NewScreen = () => {
    const {checkAccess} = useAuthorization();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [news, setNews] = useState<News[]>([]);

    /**
     * Initial data load
     * */
    useEffect(() => {
        // Check user access before fetching data
        checkAccess();
        // Fetch the product data when the component mounts
        fetchData();
    }, []);

    /**
     * Fetch the data for home page
     * */
    const fetchData = async () => {
        try {
            setLoading(true);
            // Retrieve the product data
            const response = await HttpService.get('/api/news/all');

            if (response.data.success) {
                setNews(response.data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{width: '100%', flex: 1}}>
            <ScrollView style={{width: '100%', height: '100%'}}>
                {loading && (
                    <Loading/>
                )}
                {!loading && (
                    <View style={{width: '100%', padding: 20}}>
                        {news.map((item: any, index: number) => (
                            <TouchableOpacity key={`news-${index}`} style={{width: '100%', paddingBottom: 20}} onPress={() => router.push(`/newsDetail?news_id=${item._id}`)}>
                                <View style={{
                                    width: '100%',
                                    padding: 20,
                                    borderRadius: 10,
                                    backgroundColor: '#FFF',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={{flex: 1, paddingRight: 15}}>
                                        <TouchableOpacity>
                                            <View style={{
                                                width: 100,
                                                borderRadius: 40,
                                                backgroundColor: '#d4eed6',
                                                marginBottom: 10
                                            }}>
                                                <Text style={{
                                                    padding: 5,
                                                    textAlign: "center",
                                                    fontFamily: 'Montserrat',
                                                    color: 'green',
                                                    fontSize: 13
                                                }}>{item.type}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={{fontSize: 15, lineHeight: 22, fontWeight: 400, fontFamily: 'HelvetIns'}}>
                                            {item.title}
                                        </Text>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                                <MaterialIcons name="date-range" size={20} color="#979695"/>
                                                <Text style={{color: '#979695', fontSize: 11, fontFamily: 'Montserrat'}}>
                                                    {formattedDate(item.created_at)}
                                                </Text>
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                                <Ionicons name="reader-outline" size={20} color="#979695"/>
                                                <Text style={{color: '#979695', fontSize: 11, fontFamily: 'Montserrat'}}>
                                                    {item.read_time}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Image source={{uri: item.image}}
                                           style={{width: 120, height: 120, borderRadius: 5}} resizeMode='cover'/>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

interface News {
    _id: string;
    title: string;
    read_time: string;
    image: string;
    type: string;
    created_at: string;
}

export default NewScreen