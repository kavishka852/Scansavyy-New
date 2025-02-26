import {View, Text, TouchableOpacity, Animated, ScrollView, Image, useWindowDimensions, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons, AntDesign, Feather, MaterialIcons, EvilIcons, Entypo} from '@expo/vector-icons'
import Constants from "expo-constants";

import RenderHtml, {HTMLElementModel, HTMLContentModel, MixedStyleDeclaration} from 'react-native-render-html';
import HttpService from "@/utils/httpService";
import {useAuthorization} from "@/hooks/useAuthorization";
import Loading from "@/components/Loading";


const NewsDetailScreen = () => {
    const {checkAccess} = useAuthorization();
    const {news_id} = useLocalSearchParams();
    const [onlineRef] = useState(new Animated.Value(0.5));
    const router = useRouter();
    const {width} = useWindowDimensions();
    const [loading, setLoading] = useState<boolean>(false);
    const [news, setNews] = useState<News>({
        _id: '',
        title: '',
        content: {html: ''},
        comments: [],
        writer: '',
        image: '',
        read_time: '',
        type: '',
        created_at: ''
    });

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
            const response = await HttpService.get(`/api/news/${news_id}`);

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
        <View style={{width: '100%', height: '100%', position: 'relative'}}>
            {loading && (
                <Loading/>
            )}
            {!loading && (
                <>
                    {/* background */}
                    <View style={{width: '100%', height: '40%', position: 'absolute', zIndex: 1}}>
                        <Image source={{uri: news.image}} style={{width: '100%', height: '100%'}}/>
                    </View>
                    <View style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        paddingTop: Constants.statusBarHeight + 10,
                        position: 'relative',
                        zIndex: 2
                    }}>
                        {/* header */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: '#ECECEC',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Ionicons name='chevron-back' size={24} color={'black'}/>
                                </View>
                            </TouchableOpacity>

                            <View style={{flexDirection: 'row', gap: 10}}>
                                <TouchableOpacity>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: '#ECECEC',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <AntDesign name="sharealt" size={24} color="black"/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: '#ECECEC',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <AntDesign name="tagso" size={24} color="black"/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* content */}
                        <ScrollView style={{width: '100%', flex: 1, height: '100%', paddingTop: 60, paddingHorizontal: 15}}>
                            <View style={{
                                width: '100%',
                                paddingTop: 20,
                                height: '100%',
                                backgroundColor: 'white',
                                borderRadius: 20,
                                paddingBottom: 100
                            }}>
                                <View>
                                    <TouchableOpacity style={{margin: 'auto'}}>
                                        <View style={{
                                            width: 150,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 5,
                                            padding: 5,
                                            borderRadius: 100,
                                            backgroundColor: '#2078fe',
                                            justifyContent: 'center'
                                        }}>
                                            <View style={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: '#f4f4f4',
                                                borderRadius: 20,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Image source={require("../../assets/images/avatar/1.png")} style={{
                                                    width: 20,
                                                    height: 24,
                                                    borderTopLeftRadius: 24,
                                                    borderTopRightRadius: 20
                                                }}/>
                                            </View>
                                            <Text style={{
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: 'white',
                                                fontFamily: 'Montserrat'
                                            }}>{news.writer}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* title */}
                                    <View style={{paddingTop: 15, width: '100%', paddingHorizontal: 20}}>
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: 600,
                                            color: 'black',
                                            fontFamily: 'Montserrat',
                                            lineHeight: 30,
                                            textAlign: 'center'
                                        }}>
                                            {news.title}
                                        </Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 15,
                                            gap: 20
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                gap: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Feather name="trending-up" size={24} color="#fc5507"/>
                                                <Text style={{fontFamily: 'Montserrat', fontSize: 12, color: '#4f4e4e'}}>Trending
                                                    No.1</Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                gap: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <MaterialIcons name="update" size={24} color="#bfbfbe"/>
                                                <Text style={{fontFamily: 'Montserrat', fontSize: 12, color: '#4f4e4e'}}>Trending
                                                    No.1</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {/* body */}
                                    <View style={{width: '100%', paddingHorizontal: 20, paddingTop: 20, marginBottom: 20}}>
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{html: news.content}}
                                            tagsStyles={tagsStyles}
                                            renderersProps={renderersProps}
                                        />
                                    </View>

                                    {/* comment */}
                                    <View>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: 20,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#ECECEC',
                                            paddingBottom: 10
                                        }}>

                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                                <EvilIcons name="comment" size={24} color="black"/>
                                                <Text style={{fontSize: 14, fontWeight: 500}}>Comments</Text>
                                            </View>
                                            <TouchableOpacity>
                                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                                    <Text style={{fontSize: 14, fontWeight: 500}}>Sort</Text>
                                                    <AntDesign name="filter" size={20} color="black"/>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        {/* list comment */}
                                        <View style={{width: '100%', marginTop: 10}}>
                                            <View>
                                                {news.comments.map((item: any, index: number) => (
                                                    <View key={`comments-${index}`} style={{
                                                        flexDirection: 'row',
                                                        gap: 10,
                                                        paddingVertical: 10,
                                                        borderBottomWidth: 1,
                                                        borderColor: '#ECECEC',
                                                        paddingHorizontal: 20
                                                    }}>
                                                        <View style={{
                                                            width: 50,
                                                            height: 50,
                                                            borderRadius: 25,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            position: 'relative'
                                                        }}>
                                                            <Animated.View style={
                                                                [{
                                                                    width: 15,
                                                                    height: 15,
                                                                    backgroundColor: 'green',
                                                                    borderRadius: 10,
                                                                    position: 'absolute',
                                                                    top: 2,
                                                                    left: 0,
                                                                    zIndex: 10,
                                                                    borderWidth: 1,
                                                                    borderColor: '#fff'
                                                                },
                                                                    {
                                                                        transform: [
                                                                            {
                                                                                scale: onlineRef
                                                                            },
                                                                        ],
                                                                    }
                                                                ]}></Animated.View>
                                                            <Image source={require("../../assets/images/avatar/3.png")}
                                                                   style={{width: 45, height: 45, borderRadius: 25}}/>
                                                        </View>
                                                        <View style={{flex: 1}}>
                                                            <View style={{width: '100%'}}>
                                                                <Text style={{
                                                                    fontWeight: 500,
                                                                    fontSize: 15,
                                                                    paddingBottom: 5,
                                                                    color: '#474747'
                                                                }}>Laravel New 2024</Text>
                                                                <Text style={{
                                                                    fontSize: 15,
                                                                    lineHeight: 23,
                                                                    width: '100%',
                                                                    fontFamily: 'Montserrat',
                                                                    color: '#5a5858'
                                                                }}>
                                                                    Thông thường trong các dự án của chúng ta làm
                                                                </Text>
                                                                <View style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    marginTop: 5,
                                                                    gap: 10
                                                                }}>
                                                                    <View style={{
                                                                        flexDirection: 'row',
                                                                        alignItems: 'center',
                                                                        gap: 10
                                                                    }}>
                                                                        <TouchableOpacity>
                                                                            <MaterialIcons name="more-horiz" size={24}
                                                                                           color="black"/>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity>
                                                                            <Entypo name="reply" size={24} color="black"/>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    <Text style={{fontSize: 12, fontWeight: 400}}>24/08/2024</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </>
            )}
        </View>
    )
}

const tagsStyles: Readonly<Record<string, MixedStyleDeclaration>> = {
  h2: {
    fontSize: 15,
    padding: 0,
    margin: 0,
    textTransform: 'uppercase',
  },
  p: {
    lineHeight: 28,
    color: '#000',
    fontSize: 15,
  },
  a: {
    color: 'blue',
    padding: 0,
    margin: 0,
    fontWeight: '500', // Ensure fontWeight is a string
  },
};

const renderersProps = {
  img: {
    enableExperimentalPercentWidth: true
  }
};

interface News {
    _id: string;
    title: string;
    content: any;
    comments: any;
    writer: string;
    image: string;
    read_time: string;
    type: string;
    created_at: string;
}

export default NewsDetailScreen